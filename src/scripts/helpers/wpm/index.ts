const wpm = (secs: number, wordCount: number) =>
	Math.floor((wordCount / secs) * 60);

export default wpm;
