import getQuote from "scripts/data/quotes";
import wpm from "@utils/wpm";
import timeInMins from "@utils/timeInMins";
import createTag from "@utils/createTag";
import keyCode from "@utils/keyCode";

// TODO: Use CSS modules.
enum ClassNames {
	ErrorsWrapper = ".indicators__errors-wrapper",
	SpeedWrapper = ".indicators__speed-wrapper",
	Value = ".indicators__value",
	Active = "active",
}

enum TagNames {
	Span = "span",
}

export default class TypingTest {
	letters: any;

	index: number;

	speed: number;

	errors: number;

	lastTypedChar: number | null;

	targetChar: number | null;

	startTime: number | null;

	endTime: number | null;

	DOM: {
		words?: any; // #TODO: Change this to whatever the type a DOM node is.
		indicators?: any;
	};

	constructor() {
		this.letters = "";
		this.index = 0;
		this.speed = 0;
		this.errors = 0;
		this.lastTypedChar = null;
		this.targetChar = null;
		this.startTime = null;
		this.endTime = null;
		this.DOM = {};
	}

	setActiveChar() {
		const currentNode = this.DOM.words.getElementsByTagName(TagNames.Span)[
			this.index
		];

		if (this.index !== 0) {
			const previousIndex = this.index - 1;
			const previousNode = this.DOM.words.getElementsByTagName(TagNames.Span)[
				previousIndex
			];

			previousNode.classList.remove(ClassNames.Active);
		}

		currentNode.classList.add(ClassNames.Active);
	}

	setTargetChar() {
		const targetChar = this.letters[this.index];

		this.targetChar = keyCode(targetChar);
		this.setActiveChar();
	}

	cacheDOM() {
		this.DOM.words = document.querySelector(".words");
		this.DOM.indicators = document.querySelector(".indicators");
	}

	renderWords() {
		const tag = "span";
		const html = `${this.letters
			.map((val: string, i: number) => createTag(tag, val, i))
			.join("")}`;

		this.DOM.words.innerHTML = html;
	}

	progress() {
		const userSelectedCorrectChar = this.lastTypedChar === this.targetChar;

		if (userSelectedCorrectChar) {
			this.validateChar();
		} else {
			this.invalidateChar();
		}
	}

	validateChar() {
		const targetSpan = this.DOM.words.getElementsByTagName("span")[this.index];
		const wordsLength = this.letters.length - 1;

		targetSpan.setAttribute("style", "color: #a6a8be");

		if (wordsLength !== this.index) {
			this.index += 1;
			this.setTargetChar();
		} else {
			this.endGame();
		}
	}

	invalidateChar() {
		const targetSpan = this.DOM.words.getElementsByTagName("span")[this.index];
		const errorIndicator = this.DOM.indicators.querySelector(
			`${ClassNames.ErrorsWrapper} ${ClassNames.Value}`
		);

		this.errors += 1;
		errorIndicator.innerHTML = this.errors;
		targetSpan.classList.add("error");
	}

	endGame() {
		this.endTime = Date.now();
		const endTime = timeInMins(this.startTime, this.endTime);
		const charCount = this.letters.length;
		const result = wpm(endTime, charCount, this.errors);

		const speedIndicator = this.DOM.indicators.querySelector(
			`${ClassNames.SpeedWrapper} ${ClassNames.Value}`
		);
		speedIndicator.innerHTML = result;
	}

	startTimer() {
		if (this.startTime === null) {
			this.startTime = Date.now();
		}
	}

	enqueue(event: any) {
		this.lastTypedChar = event.keyCode;

		if (this.startTime === null) {
			this.startTimer();
		}

		this.progress();
	}

	getWords() {
		return getQuote().then((res: any) => {
			const letters = res.attributes.text
				.toLowerCase()
				.replace(/[.,'\\/#!$%\\^&\\*;:{}=\-_`~()]/g, "")
				.split("");
			this.letters = letters;
		});
	}

	keypressListener = (callback: any) => {
		const EVENT_KEYDOWN = "keydown";
		return document.addEventListener(EVENT_KEYDOWN, (event) => callback(event));
	};

	init() {
		this.getWords().then(() => {
			this.cacheDOM();
			this.renderWords();
			this.setTargetChar();
			this.keypressListener(this.enqueue.bind(this));
		});
	}
}
