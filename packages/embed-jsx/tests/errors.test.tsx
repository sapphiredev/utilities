// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EmbedJsx } from '../src';

test('throw an error at invalid options', () => {
	const embedFn = (): any => (
		<embed>
			<wrong />
		</embed>
	);
	expect(embedFn).toThrow(
		new TypeError(
			'Invalid type passed, expected one of embed, title, field, timestamp, footer, description, image, thumbnail, author; got: wrong'
		)
	);
});

describe('validateTitleData', () => {
	test('invalid props', () => {
		const embedFn = (): any => (
			<embed>
				<title invalidProp>Hello, world!</title>
			</embed>
		);

		expect(embedFn).toThrow("Title Validation Error: Invalid properties were passed, expected props are 'url'");
	});

	test('invalid url type', () => {
		const embedFn = (): any => (
			<embed>
				<title url>Hello</title>
			</embed>
		);
		expect(embedFn).toThrow('Title Validation Error: URL should be of type string, got: boolean');
	});
});

describe('validateFieldData', () => {
	test('invalid props', () => {
		const embedFn = (): any => (
			<embed>
				<field blah>Blah Blah Blah</field>
			</embed>
		);
		expect(embedFn).toThrow("Field Validation Error: Invalid properties were passed, expected props are 'name', 'inline'");
	});

	test('invalid name type', () => {
		const embedFn = (): any => (
			<embed>
				<field name>Test</field>
			</embed>
		);
		expect(embedFn).toThrow('Field Validation Error: Name should be of type string, got: boolean');
	});

	test('invalid inline type', () => {
		const embedFn = (): any => (
			<embed>
				<field inline="hello">Test</field>
			</embed>
		);
		expect(embedFn).toThrow('Field Validation Error: Inline should be of type boolean, got: string');
	});
});

describe('validateFooterData', () => {
	test('invalid props', () => {
		const embedFn = (): any => (
			<embed>
				<footer test>Feet</footer>
			</embed>
		);
		expect(embedFn).toThrow("Footer Validation Error: Invalid properties were passed, expected props are 'iconURL'");
	});

	test('invalid iconURL type', () => {
		const embedFn = (): any => (
			<embed>
				<footer iconURL></footer>
			</embed>
		);
		expect(embedFn).toThrow('Footer Validation Error: iconURL should be of type string, got: boolean');
	});

	test('invalid footer value', () => {
		const embedFn = (): any => (
			<embed>
				<footer />
			</embed>
		);
		expect(embedFn).toThrow('Footer Validation Error: Footer value should be of type string, got: undefined');
	});
});

describe('validateDescriptionData', () => {
	test('invalid description value', () => {
		const embedFn = (): any => (
			<embed>
				<description />
			</embed>
		);
		expect(embedFn).toThrow('Description Validation Error: Data passed should be a string, got: undefined');
	});
});

describe('validateImageData', () => {
	test('invalid props (image)', () => {
		const embedFn = (): any => (
			<embed>
				<image blah />
			</embed>
		);
		expect(embedFn).toThrow("Image Validation Error: Invalid properties were passed, expected props are 'url'");
	});

	test('invalid props (thumbnail)', () => {
		const embedFn = (): any => (
			<embed>
				<thumbnail blah />
			</embed>
		);
		expect(embedFn).toThrow("Thumbnail Validation Error: Invalid properties were passed, expected props are 'url'");
	});
});

describe('validateAuthorData', () => {
	test('invalid props', () => {
		const embedFn = (): any => (
			<embed>
				<author blah />
			</embed>
		);
		expect(embedFn).toThrow("Author Validation Error: Invalid properties were passed, expected props are 'url', 'iconURL'");
	});

	test('invalid url type', () => {
		const embedFn = (): any => (
			<embed>
				<author url />
			</embed>
		);
		expect(embedFn).toThrow('Author Validation Error: URL should be of type string, got: boolean');
	});

	test('invalid iconURL type', () => {
		const embedFn = (): any => (
			<embed>
				<author iconURL />
			</embed>
		);
		expect(embedFn).toThrow('Author Validation Error: Icon URL should be of type string, got: boolean');
	});

	test('invalid author value', () => {
		const embedFn = (): any => (
			<embed>
				<author />
			</embed>
		);
		expect(embedFn).toThrow('Author Validation Error: Author value should be of type string, got: undefined');
	});
});
