require('@testing-library/jest-dom');

if (typeof global.TextEncoder === 'undefined') {
	try {
		const { TextEncoder, TextDecoder } = require('util');
		global.TextEncoder = TextEncoder;
		global.TextDecoder = TextDecoder;
	} catch (e) {
	}
}