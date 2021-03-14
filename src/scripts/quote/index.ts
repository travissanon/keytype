import randNum from "scripts/helpers/randNum";

// Reference https://github.com/Miodec/monkeytype/blob/62f32f57349d1eda9e4c6b545f486d3b419cba73/src/js/script.js#L473

const getQuote = async () => {
	const QUOTES_API = "https://randomstoicquotesapi.herokuapp.com/api/v1/quotes";
	const data = await fetch(QUOTES_API)
		.then((res) => res.json())
		.then((res) => res.data[randNum(res.data.length, 0)])
		.catch((err) => console.error(err));

	return data;
};

export default getQuote;
