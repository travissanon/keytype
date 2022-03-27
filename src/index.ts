import TypingTest from "@components/typingTest";

import "@styles/normalize.css";
import "@styles/style.scss";

const markup = `
    <div class="header">
        <div class="header__logo">keytype</div>
            <div class="header__menu">
                <div class="header__icon header__about">
                    <img src="../assets/information--square--filled.svg" />
                </div>
                <div class="header__icon header__settings">
                    <img src="../assets/settings.svg" />
                </div>
                <div class="header__icon header__account">
                    <img src="../assets/user.svg" />
                </div>
            </div>
        </div>
        <div class="typing-test">
        <div class="typing-test__container">
            <div class="typing-test__wrapper">
            <div class="typing-test__indicators">
                <div class="typing-test__indicators-container">
                <div class="typing-test__speed-wrapper">
                    <span class="typing-test__speed">WPM:</span>
                    <span class="typing-test__value">--</span>
                </div>
                <div class="typing-test__errors-wrapper">
                    <span class="typing-test__errors">ERR:</span>
                    <span class="typing-test__value">--</span>
                </div>
                </div>
            </div>
            <div class="typing-test__words-container">
                <div class="typing-test__words"></div>
            </div>
            <div class="typing-test__restart">
                <img src="../assets/rotate-ccw.svg" />
            </div>
            </div>
        </div>
        <div class="typing-test__footer"></div>
    </div>
`;
const root = document.querySelector("#root");
const test = new TypingTest();

root.innerHTML = markup;

test.init();
