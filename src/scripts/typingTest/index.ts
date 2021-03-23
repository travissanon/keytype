import getQuote from "scripts/data/quotes";
import wpm from "@utils/wpm";
import timeInMins from "@utils/timeInMins";
import createTag from "@utils/createTag";
import keyCode from "@utils/keyCode";

interface DOMNode {
	[key: string]: Element | null;
}

interface KeyError {
	[key: number]: boolean;
}

// TODO: Use CSS modules.
enum ClassNames {
	ErrorsWrapper = ".typing-test__errors-wrapper",
	SpeedWrapper = ".typing-test__speed-wrapper",
	Value = ".typing-test__value",
	Active = "active",
}

enum TagNames {
	Span = "span",
}

export default class TypingTest {
	private letters: string[] = [];

	private index: number = 0;

	private speed: number = 0;

	private errors: KeyError = {};

	private lastTypedChar: number | null = null;

	private targetChar: number | null = null;

	private startTime: number | null = null;

	private endTime: number | null = null;

	private DOM: DOMNode = {};

	setActiveChar(): void {
		const currentNode = this.DOM.words.getElementsByTagName(TagNames.Span)[
			this.index
		];

		if (this.index !== 0) {
			const previousIndex: number = this.index - 1;
			const previousNode: Element = this.DOM.words.getElementsByTagName(
				TagNames.Span
			)[previousIndex];

			previousNode.classList.remove(ClassNames.Active);
		}

		currentNode.classList.add(ClassNames.Active);
	}

	setTargetChar(): void {
		const targetChar: string = this.letters[this.index];

		this.targetChar = keyCode(targetChar);
		this.setActiveChar();
	}

	cacheDOM(): void {
		this.DOM.words = document.querySelector(".typing-test__words");
		this.DOM.indicators = document.querySelector(".typing-test__indicators");
	}

	renderWords(): void {
		const TAG_SPAN: string = "span";
		const html: string = `${this.letters
			.map((val: string, i: number) => createTag(TAG_SPAN, val, i))
			.join("")}`;

		this.DOM.words.innerHTML = html;
	}

	progress(): void {
		const userSelectedCorrectChar = this.lastTypedChar === this.targetChar;

		if (userSelectedCorrectChar) {
			this.validateChar();
		} else {
			this.invalidateChar();
		}
	}

	validateChar(): void {
		const targetSpan: Element = this.DOM.words.getElementsByTagName("span")[
			this.index
		];
		const wordsLength: number = this.letters.length - 1;

		targetSpan.setAttribute("style", "color: #a6a8be");

		if (wordsLength !== this.index) {
			this.index += 1;
			this.setTargetChar();
		} else {
			this.endGame();
		}
	}

	invalidateChar(): void {
		const targetSpan: Element = this.DOM.words.getElementsByTagName("span")[
			this.index
		];
		const errorIndicator: Element = this.DOM.indicators.querySelector(
			`${ClassNames.ErrorsWrapper} ${ClassNames.Value}`
		);

		this.errors[this.index] = true;
		errorIndicator.innerHTML = Object.keys(this.errors).length.toString();
		targetSpan.classList.add("error");
	}

	endGame(): void {
		this.endTime = Date.now();

		const endTime: number = timeInMins(this.startTime, this.endTime);
		const charCount: number = this.letters.length;
		const errCount: number = Object.keys(this.errors).length;
		const result: string = wpm(endTime, charCount, errCount).toString();
		const speedIndicator = this.DOM.indicators.querySelector(
			`${ClassNames.SpeedWrapper} ${ClassNames.Value}`
		);

		speedIndicator.innerHTML = result;
	}

	startTimer(): void {
		if (this.startTime === null) {
			this.startTime = Date.now();
		}
	}

	enqueue(event: any): void {
		this.lastTypedChar = event.keyCode;

		if (this.startTime === null) {
			this.startTimer();
		}

		this.progress();
	}

	getWords(): Promise<string[] | void> {
		return getQuote().then((res: any) => {
			const letters: string[] = res.attributes.text
				.toLowerCase()
				.replace(/[.,'\\/#!$%\\^&\\*;:{}=\-_`~()?]/g, "")
				.split("");
			this.letters = letters;
		});
	}

	keypressListener = (callback: any): void => {
		const EVENT_KEYDOWN: string = "keydown";
		document.addEventListener(EVENT_KEYDOWN, (event) => callback(event));
	};

	init(): void {
		this.getWords().then(() => {
			this.cacheDOM();
			this.renderWords();
			this.setTargetChar();
			this.keypressListener(this.enqueue.bind(this));
		});
	}
}
