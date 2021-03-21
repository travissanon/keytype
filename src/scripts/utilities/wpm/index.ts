const wpm = (mins: number, charCount: number, errors: number) => {
	const grossWpm = Math.floor(charCount / 5 / mins);
	const netWpm = Math.floor(grossWpm - errors / mins);

	return netWpm;
};

export default wpm;
