// First version of the typing test.

const initialState = () => ({
  words: 'at the end of the day you are solely responsible for your success and your failure',
  // words: "at the end of the day you are solely responsible for your success and your failure and the sooner you realize that you accept that and integrate that into your work ethic you will start being successful as long as you blame others for the reason you arent where you want to be you will always be a failure",
  index: 0,
  speed: 0,
  errors: 0,
  lastTypedChar: null,
  targetChar: null,
  startTime: null,
  endTime: null,
});

// Mutable state
const state = initialState();

const pipe = (...fns) => (x) => [...fns].reduce((acc, f) => f(acc), x);
const merge = (o1) => (o2) => Object.assign({}, o1, o2);

const wordsNode = document.querySelector('.words');
const indicatorsNode = document.querySelector('.indicators');

const splitStr = (separator) => (str) => str.split(separator);
const count = (a) => a.length;
const wordCount = (str) => pipe(splitStr(' '), count)(str);

const getTag = (node, tag, i) => node.getElementsByTagName(tag)[i];
const generateTag = (tag, val, key) => `<${tag} key="${key}">${val}</${tag}>`;
const generateWordsHtml = (arr) => `${arr.map((val, i) => generateTag('span', val, i)).join('')}`;
const renderWords = () => (wordsNode.innerHTML = generateWordsHtml(splitStr('')(state.words)));

const keyCode = (i, str) => (str.charCodeAt(i) - 32 === 0 ? 32 : str.charCodeAt(i) - 32);

const setTargetChar = () => (state.targetChar = keyCode(state.index, state.words));
const setActiveChar = () => {
  const index = state.index;

  if (index !== 0) {
    getTag(wordsNode, 'span', index - 1).classList.remove('active');
  }

  getTag(wordsNode, 'span', index).classList.add('active');
};

const time = (start, end) => (end - start) / 1000;
const wpm = (secs) => (wordCount) => Math.floor((wordCount / secs) * 60);

const progress = (e) => {
  if (state.startTime === null) {
    state.startTime = Date.now();
  }

  if (state.lastTypedChar === state.targetChar) {
    const targetSpan = wordsNode.getElementsByTagName('span')[state.index];
    const wordsLength = state.words.length - 1;

    targetSpan.setAttribute('style', 'color: #a6a8be');

    if (wordsLength !== state.index) {
      state.index = state.index + 1;
      setTargetChar();
      setActiveChar();
    } else {
      state.endTime = Date.now();
      const result = wpm(time(state.startTime, state.endTime))(wordCount(state.words));

      const speedIndicator = indicatorsNode.querySelector(
        '.indicators__speed-wrapper .indicators__value'
      );
      speedIndicator.innerHTML = result;
    }
  } else {
    state.errors = state.errors + 1;
    const errorIndicator = indicatorsNode.querySelector(
      '.indicators__errors-wrapper .indicators__value'
    );
    const targetSpan = wordsNode.getElementsByTagName('span')[state.index];

    errorIndicator.innerHTML = state.errors;
    targetSpan.classList.add('error');
  }
};

const enqueue = (e) => {
  state.lastTypedChar = e.keyCode;
  progress(e);
};

const keypressListener = (cb) => document.addEventListener('keydown', (e) => cb(e));

// render words & listen for keystrokes
const main = () => {
  renderWords();
  setTargetChar();
  setActiveChar();
  keypressListener(enqueue);
};

// Main
main();
