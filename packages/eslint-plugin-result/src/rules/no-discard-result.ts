import { AST_NODE_TYPES, ESLintUtils, TSESTree, type ParserServices } from '@typescript-eslint/utils';
import type { RuleListener, RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { isThenableType, isUnionType } from 'tsutils';
import ts from 'typescript';

type Options = [];

const messages = {
	discardedResult: 'This function returns a Result, but its return value is being discarded.'
} as const;

type Messages = keyof typeof messages;

const resultPath = require.resolve('@sapphire/result').split('/').slice(0, -1).concat('index.d.ts').join('/');

function getSapphireResultType(service: ParserServices, checker: ts.TypeChecker): ts.Type | null {
	const file = service.program?.getSourceFile(resultPath);
	const resultNode = file?.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.getText() === 'Result');
	if (resultNode) {
		return checker.getTypeAtLocation(resultNode);
	}

	return null;
}

function unwrapPotentialPromiseType(checker: ts.TypeChecker, node: ts.CallExpression, type = checker.getTypeAtLocation(node)): ts.Type {
	if (isUnionType(type)) {
		// Don't want to actually mutate, it can cause issues for other callers
		const { ...copy } = type;

		// We can end up with null-ish values in the union type, so we filter them out
		copy.types = type.types.filter((subtype) => Boolean(subtype));

		// There's some odd cases where the union type is just a single type that is sort of itself, so we unwrap that
		if (copy.types.length === 1) {
			return unwrapPotentialPromiseType(checker, node, copy.types[0]);
		}

		copy.types = copy.types.map((subtype) => unwrapPotentialPromiseType(checker, node, subtype));
		return copy;
	}

	if (isThenableType(checker, node)) {
		return checker.getTypeArguments(type as ts.TypeReference)[0]!;
	}

	return type;
}

function functionHasResultLikeReturnType(service: ParserServices, checker: ts.TypeChecker, node: ts.CallExpression): boolean {
	const functionDeclaration = checker.getResolvedSignature(node);
	if (!functionDeclaration) {
		return false;
	}

	const returnType = unwrapPotentialPromiseType(checker, node);
	const resultType = getSapphireResultType(service, checker);

	if (!returnType.aliasSymbol || !resultType?.aliasSymbol) {
		return false;
	}

	// Bit hacky until we have https://github.com/microsoft/TypeScript/issues/9879
	return Reflect.get(returnType.aliasSymbol, 'id') === Reflect.get(resultType.aliasSymbol, 'id');
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

export const noDiscardResult: RuleModule<'discardedResult', [], RuleListener> = ESLintUtils.RuleCreator.withoutDocs<Options, Messages>({
	meta: {
		messages,
		type: 'problem',
		schema: []
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
