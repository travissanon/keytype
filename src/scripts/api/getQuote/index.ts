import randNum from "@utils/randNum";

const QUOTES_API = "https://randomstoicquotesapi.herokuapp.com/api/v1/quotes";

// Reference https://github.com/Miodec/monkeytype/blob/62f32f57349d1eda9e4c6b545f486d3b419cba73/src/js/script.js#L473
const getQuote = async () => {
	let randomQuote;

	try {
		const response = await fetch(QUOTES_API).then((res) => res.json());

		randomQuote = await response.data[randNum(response.data.length, 0)];
	} catch (err) {
		throw new Error(err);
	}

	return randomQuote;
};

export default getQuote;
