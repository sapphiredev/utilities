import { AST_NODE_TYPES, ESLintUtils, type ParserServices, type TSESTree } from '@typescript-eslint/utils';
import { createRequire } from 'node:module';
import { isThenableType, isUnionType } from 'tsutils';
import ts from 'typescript';

type Options = [];

const messages = {
	discardedResult: 'This function returns a Result, but its return value is being discarded.'
} as const;

type Messages = keyof typeof messages;

const resultPath = createRequire(import.meta.url)
	.resolve('@sapphire/result')
	.split('/')
	.slice(0, -1)
	.concat('index.d.mts')
	.join('/');

function getSapphireResultType(service: ParserServices, checker: ts.TypeChecker): ts.Type | null {
	const file = service.program?.getSourceFile(resultPath);
	const resultNode = file?.statements.find((node) => ts.isClassDeclaration(node) && node.name?.text === 'Result');
	if (resultNode) {
		return checker.getTypeAtLocation(resultNode);
	}

	return null;
}

function typeHasResultSymbol(checker: ts.TypeChecker, node: ts.CallExpression, type: ts.Type, resultSymbol: ts.Symbol): boolean {
	if (isUnionType(type)) {
		return type.types.some((subtype) => typeHasResultSymbol(checker, node, subtype, resultSymbol));
	}

	if (isThenableType(checker, node, type)) {
		const promisedType = checker.getTypeArguments(type as ts.TypeReference)[0];
		return promisedType !== undefined && typeHasResultSymbol(checker, node, promisedType, resultSymbol);
	}

	return type.getSymbol() === resultSymbol;
}

function functionHasResultLikeReturnType(service: ParserServices, checker: ts.TypeChecker, node: ts.CallExpression): boolean {
	const functionDeclaration = checker.getResolvedSignature(node);
	if (!functionDeclaration) {
		return false;
	}

	const returnType = checker.getTypeAtLocation(node);
	const resultType = getSapphireResultType(service, checker);
	const resultSymbol = resultType?.getSymbol?.();

	return resultSymbol !== undefined && typeHasResultSymbol(checker, node, returnType, resultSymbol);
}

function isDiscardedResult(callExpressionNode: TSESTree.Node): boolean {
	// `void foo();` is explicit and allowed
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.UnaryExpression && callExpressionNode.parent.operator === 'void') {
		return false;
	}

	// Check for a variable declaration
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.VariableDeclarator) {
		return false;
	}

	// Check for assignment
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.AssignmentExpression) {
		return false;
	}

	// check for foo(functionReturningResult())
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.CallExpression) {
		return false;
	}

	if (
		callExpressionNode.parent?.type === AST_NODE_TYPES.ReturnStatement ||
		callExpressionNode.parent?.type === AST_NODE_TYPES.ArrowFunctionExpression
	) {
		return false;
	}

	// Check for stuff like (void 0, x())
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.SequenceExpression) {
		return isDiscardedResult(callExpressionNode.parent);
	}

	// Check for awaits
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.AwaitExpression) {
		return isDiscardedResult(callExpressionNode.parent);
	}

	// check for ternary conditional
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.ConditionalExpression) {
		return isDiscardedResult(callExpressionNode.parent);
	}

	// check for ||, && and ?? operators
	if (callExpressionNode.parent?.type === AST_NODE_TYPES.LogicalExpression) {
		return isDiscardedResult(callExpressionNode.parent);
	}

	return true;
}

export const noDiscardResult = ESLintUtils.RuleCreator(
	(ruleName) => `https://github.com/sapphiredev/utilities/blob/main/packages/eslint-plugin-result/src/rules/${ruleName}.ts`
)<Options, Messages>({
	name: 'no-discard-result',
	meta: {
		messages,
		type: 'problem',
		schema: [],
		docs: {
			description: 'Disallow discarding the result of functions returning a Result-like type',
			dialects: ['javascript', 'typescript'],
			frozen: true
		}
	},
	defaultOptions: [],
	create: (context) => {
		return {
			CallExpression(callExpressionNode): void {
				const service = ESLintUtils.getParserServices(context);
				const checker = service.program.getTypeChecker();

				// First check if our function returns a Result to begin with
				if (!functionHasResultLikeReturnType(service, checker, service.esTreeNodeToTSNodeMap.get(callExpressionNode))) {
					return;
				}

				if (isDiscardedResult(callExpressionNode)) {
					context.report({ messageId: 'discardedResult', node: callExpressionNode });
				}
			}
		};
	}
});
