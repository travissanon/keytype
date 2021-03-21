const randNum = (max: number, min: number = 0) => {
	const roundMin = Math.ceil(min);
	const roundMax = Math.floor(max);

	return Math.floor(Math.random() * (roundMax - roundMin) + roundMin);
};

export default randNum;
