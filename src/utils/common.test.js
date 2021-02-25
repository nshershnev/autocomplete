import { getLastWord, getLastTwoWords } from './common';

describe('Common utils methods test', () => {
	it('it should get last word from sentence', () => {
		const [lastWord] = getLastWord('Hello world');
		expect(lastWord).toEqual('world');
	});

	it('it should convert Arabic to Roman number', () => {
		const [lastTwoWords] = getLastTwoWords('Hello world');
		expect(lastTwoWords).toEqual('Hello world');
	});
});
