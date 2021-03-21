const keyCode = (char: string) => {
	const SPACEBAR_KEYCODE = 32;
	const CHAR_INDEX = 0;

	const charKeyCode = char.charCodeAt(CHAR_INDEX) - SPACEBAR_KEYCODE;

	return charKeyCode === 0 ? SPACEBAR_KEYCODE : charKeyCode;
};

export default keyCode;
