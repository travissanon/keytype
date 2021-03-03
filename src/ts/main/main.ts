class TypingTest {
  words: string;

  index: number;

  speed: number;

  errors: number;

  lastTypedChar: string | null;

  targetChar: number | null;

  startTime: number | null;

  endTime: number | null;

  DOM: {
    words?: any; // #TODO: Change this to whatever the type a DOM node is.
    indicators?: any;
  };

  constructor() {
    this.words =
      'at the end of the day you are solely responsible for your success and your failure';
    this.index = 0;
    this.speed = 0;
    this.errors = 0;
    this.lastTypedChar = null;
    this.targetChar = null;
    this.startTime = null;
    this.endTime = null;
    this.DOM = {};
  }

  pipe(...fns: any[]) {
    return (x: any) => [...fns].reduce((acc, f) => f(acc), x);
  }

  setActiveChar() {
    const TAG_ACTIVE = 'active';
    const getNodeByTag = (node: any, tag: string, i: number) => node.getElementsByTagName(tag)[i];
    const removeClassFromNode = (node: any, tag: string) => node.classList.remove(tag);

    if (this.index !== 0) {
      const node = getNodeByTag(this.DOM.words, 'span', this.index - 1);
      removeClassFromNode(node, TAG_ACTIVE);
    }
  }

  setTargetChar() {
    const SPACEBAR_KEYCODE = 32;
    const keyCode = (i: number, str: string) =>
      str.charCodeAt(i) - SPACEBAR_KEYCODE === 0
        ? SPACEBAR_KEYCODE
        : str.charCodeAt(i) - SPACEBAR_KEYCODE;

    this.targetChar = keyCode(this.index, this.words);
  }

  cacheDOM() {
    this.DOM.words = document.querySelector('.words');
    this.DOM.indicators = document.querySelector('.indicators');
  }

  // bindEvents() {}

  createTag(tag: string, val: any, key: number | null = null) {
    const isKey = key ? `key="${key}"` : '';

    return `
                <${tag} ${isKey}>
                    ${val}
                </${tag}>
            `;
  }

  renderWords() {
    const tag = 'span';
    const letters = this.words.split('');
    const html = `${letters.map((val, i) => this.createTag(tag, val, i)).join('')}`;

    this.DOM.words.innerHTML = html;
  }

  progress() {
    const splitStr = (separator: string) => (str: string) => str.split(separator);
    const count = (a: any) => a.length;
    const time = (start: number, end: number) => (end - start) / 1000;
    const wpm = (secs: number) => (wordCount: number) => Math.floor((wordCount / secs) * 60);
    const wordCount = (str: string) => this.pipe(splitStr(' '), count)(str);

    // TODO: Loop up an enum guide for css classes
    enum ClassIndicators {
      ErrorsWrapper = '.indicators__errors-wrapper',
      SpeedWrapper = '.indicators__speed-wrapper',
      Value = '.indicators__value',
    }

    // TODO: Possibly turn this into a ternary operator
    if (this.lastTypedChar === this.targetChar) {
      // TODO: Break this block off into a function
      const targetSpan = this.DOM.words.getElementsByTagName('span')[this.index];
      const wordsLength = this.words.length - 1;

      targetSpan.setAttribute('style', 'color: #a6a8be');

      if (wordsLength !== this.index) {
        this.index += 1;
        this.setTargetChar();
        this.setActiveChar();
      } else {
        this.endTime = Date.now();
        const result = wpm(time(this.startTime, this.endTime))(wordCount(this.words));

        const speedIndicator = this.DOM.indicators.querySelector(
          `${ClassIndicators.SpeedWrapper} ${ClassIndicators.Value}`
        );
        speedIndicator.innerHTML = result;
      }
    } else {
      // TODO: Break this block off into a function
      const targetSpan = this.DOM.words.getElementsByTagName('span')[this.index];
      const errorIndicator = this.DOM.indicators.querySelector(
        `${ClassIndicators.ErrorsWrapper} ${ClassIndicators.Value}`
      );

      this.errors += 1;
      errorIndicator.innerHTML = this.errors;
      targetSpan.classList.add('error');
    }
  }

  startTimer() {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  enqueue(event: any) {
    this.lastTypedChar = event.keyCode;
    this.startTimer();
    this.progress();
  }

  keypressListener(callback: any) {
    const EVENT_KEYDOWN = 'keydown';

    return document.addEventListener(EVENT_KEYDOWN, (event) => callback(event));
  }

  init() {
    this.cacheDOM();
    this.renderWords();
    this.setTargetChar();
    this.setActiveChar();
    this.keypressListener(this.enqueue);
  }
}
