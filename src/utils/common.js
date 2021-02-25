export const getLastWord = (input) => {
	const res = /\S+$/.exec(input);
	return res || [];
};

export const getLastTwoWords = (input) => {
	const res = input.match(/[^ ]* [^ ]*$/g);
	return res || [];
};
