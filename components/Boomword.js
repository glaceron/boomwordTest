/* eslint-disable prefer-regex-literals */
import WORDS from "../assets/listado_palabras.json";
import KEYBOARD_INITIAL_STATE from "../assets/keyboardState.json";
import "./BoomwordKeyboard.js";

const LETTERS = [
  "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
  "a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ",
  "z", "x", "c", "v", "b", "n", "m"
];

class Boomword extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.wordToTry = "";
    this.failMsg = "";
    this.pattern = new RegExp("^[A-ZñÑáéíóúÁÉÍÓÚ]+$", "i");
    this.play = "false";
    this.playing = false;
    this.score = 0;
    this.lives = window.localStorage.getItem("lives");
    this.playButtonText = "Jugar";
  }

  static get styles() {
    return /* css */`

    @media screen and (max-width: 480px) {
      #playButton{
        --button-outline: white solid 2px;
      }
    }

    @media screen and (min-width: 480px) {
      #playButton{
        --button-outline: transparent solid 2px;
      }
    }


        :host {
          font-family: Monserrat, sans-serif;
        }

        .container {
          justify-content: center;
          display:flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: max-content;
        }

        #wordToTry {
          display:flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 10vh;
          text-transform: uppercase;
        }


        #bomb {
          position: relative;
          font-size: 20px;

        }

        .bombIcon {
          position: relative;
          font-size: 20px;
          left: 24px;
          animation-name: bombAnimation;
          animation-duration: 450ms;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          transform-origin: 70px 105px;
        }

        @keyframes bombAnimation {
          0% {
            transform: scale(1);
            content: url("./assets/bomb1.svg");
          }

          33% {
            transform: scale(1);
            content: url("./assets/bomb2.svg");
          }

          66% {
            transform: scale(1.1);
            content: url("./assets/bomb1.svg");
          }

          100% {
            transform: scale(1.1);
            content: url("./assets/bomb2.svg");
          }
        }

        #bombText {
          color: white;
          position: absolute;
          text-align: center;
          font-weight: bold;
          font-size: 24px;
          text-transform: uppercase;
          width: 60px;
          height: 28px;
          bottom: 44px;
          left: 62px;
        }

        #lives{
          display:fixed;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        #score{
          display:flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .heart {
          height:55px;
          width:55px;
        }

        #playButton {
          background-color:rgb(23, 23, 24);
          color: white;
          padding: 10px;
          vertical-align: center;
          width: 80px;
          text-align: center;
          outline: var(--button-outline);
          outline-offset: 2px;
          border-radius: 4px;
          transition: 0.3s;
          margin-bottom: 25px;
        }

        #playButton:hover {
          background-color: rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }

        #fail {
          text-align: center;
          margin-bottom: 25px;
          margin-top: 25px;
        }

    `;
  }

  connectedCallback() {
    this.render();
    this.checkLastTry();
    this.keyboard = this.shadowRoot.querySelector("boomword-keyboard");
    document.addEventListener("keydown", (ev) => this.keyPressed(ev.key));
    document.addEventListener("keyboard", (ev) => this.keyPressed(ev.detail));
    this.addEventListener("KEYBOARD_SET_LETTER", (ev) => this.keyboard.setLetter(ev.detail.letter, ev.detail.className));
  }

  hideDiv(div) {
    this.divToHide = this.shadowRoot.getElementById(div);
    this.divToHide.style.display = "none";
  }

  showDiv(div) {
    this.divToShow = this.shadowRoot.getElementById(div);
    this.divToShow.style.display = "flex";
  }

  getTomorrowTimestamp() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }

  keyPressed(key) {
    if (this.pattern.test(key) && (key.length < 2) && (this.playing)) {
      const keyLowered = key.toLowerCase();
      this.wordToTry = this.wordToTry + keyLowered;
      this.render();
      this.hideDiv("fail");
      this.drawLives();
      this.hideDiv("playButton");
    }

    if ((key == "Enter") && (this.playing)) {
      this.win = false;
      this.check();
      if (this.win === false) {
        this.render();
        this.hideDiv("fail");
        this.drawLives();
        this.hideDiv("playButton");
      } else {
        this.winScreen();
      }
    }

    if ((key == "Backspace") && (this.playing)) {
      this.wordToTry = this.wordToTry.slice(0, -1);
      this.render();
      this.hideDiv("fail");
      this.drawLives();
      this.hideDiv("playButton");
    }
  }

  checkLastTry() {
    if ((Date.now() > window.localStorage.getItem("nextDay")) && (window.localStorage.getItem("endedTry") == "YES")) {
      window.localStorage.setItem("lives", 3);
      window.localStorage.setItem("win", "NO");
      window.localStorage.setItem("endedTry", "NO");
      console.log("Ya puedes jugar de nuevo");
    } else {
      console.log("Aun no puedes jugar, tienes que esperar a mañana");
    }
    this.checkStart();
  }

  checkStart() {
    if (window.localStorage.getItem("win") == "YES") {
      this.failMsg = "Has ganado el desafío!.<br> <br>Intentalo de nuevo mañana.";
      this.render();
      this.drawLives();
      this.hideDiv("playButton");
      this.hideDiv("bomb");
    } else {
      if (window.localStorage.getItem("lives") == 3) {
        this.hideDiv("lives");
        this.hideDiv("score");
        this.hideDiv("bomb");
      } else if (window.localStorage.getItem("lives") != 0) {
        this.showDiv("playButton");
        this.render();
        this.hideDiv("bomb");
        this.drawLives();
      }

      if (window.localStorage.getItem("lives") == 0) {
        console.log("0 vidas");
        this.failMsg = "Te has quedado sin vidas.<br><br>Intentalo de nuevo mañana.";
        this.showDiv("fail");
        this.render();
        this.drawLives();
        this.hideDiv("playButton");
        this.hideDiv("bomb");
      }

      if (window.localStorage.getItem("firstTime") == null) {
        console.log("Es la primera vez");
        this.hideDiv("lives");
        this.hideDiv("score");
      }
    }
  }

  drawLives() {
    this.heart1 = this.shadowRoot.getElementById("heart1");
    this.heart2 = this.shadowRoot.getElementById("heart2");
    this.heart3 = this.shadowRoot.getElementById("heart3");

    if (window.localStorage.getItem("lives") == 3) {
      this.heart1.style.content = "url(\"./assets/heart.png\")";
      this.heart2.style.content = "url(\"./assets/heart.png\")";
      this.heart3.style.content = "url(\"./assets/heart.png\")";
    }

    if (window.localStorage.getItem("lives") == 2) {
      this.heart1.style.content = "url(\"./assets/heart.png\")";
      this.heart2.style.content = "url(\"./assets/heart.png\")";
      this.heart3.style.content = "url(\"./assets/heartVoid.png\")";
    }

    if (window.localStorage.getItem("lives") == 1) {
      this.heart1.style.content = "url(\"./assets/heart.png\")";
      this.heart2.style.content = "url(\"./assets/heartVoid.png\")";
      this.heart3.style.content = "url(\"./assets/heartVoid.png\")";
    }

    if (window.localStorage.getItem("lives") == 0) {
      this.heart1.style.content = "url(\"./assets/heartVoid.png\")";
      this.heart2.style.content = "url(\"./assets/heartVoid.png\")";
      this.heart3.style.content = "url(\"./assets/heartVoid.png\")";
    }
  }

  timeOut() {
    this.lives = window.localStorage.getItem("lives");
    this.lives--;
    window.localStorage.setItem("lives", this.lives);
    this.playing = false;

    if (window.localStorage.getItem("lives") > 0) {
      this.failMsg = "Podías haber respondido: " + this.randomWord + "<br> <br>Has fallado";
      this.playButtonText = "Continuar";
      this.showDiv("playButton");
      this.render();
      this.hideDiv("bomb");
      this.drawLives();
      this.hideDiv("wordToTry");
    }
    if (window.localStorage.getItem("lives") == 0) {
      this.failMsg = "Podías haber respondido:" + this.randomWord + "<br> <br> Te has quedado sin vidas.<br> <br>Intentalo de nuevo mañana.";
      window.localStorage.setItem("endedTry", "YES");
      window.localStorage.setItem("nextDay", this.getTomorrowTimestamp());
      window.localStorage.setItem("firstTime", "NO");
      console.log(Date.now());
      this.render();
      this.drawLives();
      this.hideDiv("bomb");
      this.hideDiv("playButton");
      this.hideDiv("wordToTry");
    }
  }

  paintKey(letter) {
    if ((letter == "á") || (letter == "é") || (letter == "í") || (letter == "ó") || (letter == "ú")) {
      this.keyboardSetLetter(letter, "exactMark");
    } else if ((letter == "x") || (letter == "k") || (letter == "y") || (letter == "w")) {
      this.keyboardSetLetter(letter, "specialMark");
    } else {
      this.keyboardSetLetter(letter, "exact");
    }
  }

  checkLetters() {
    const word = this.wordToTry.toString();
    const possibleLetters = word.split("");

    possibleLetters.forEach(element => this.paintKey(element));
  }

  keyboardSetLetter(letter, className) {
    const event = new CustomEvent("KEYBOARD_SET_LETTER", { composed: true, bubbles: true, detail: { letter, className } });
    this.dispatchEvent(event);
  }

  checkWin(state) {
    if (state == "unused") {
      this.win = false;
      console.log("Aun faltan letras");
    }
  }

  winScreen() {
    console.log("Has ganado, has acertado todas las letras.");
    this.failMsg = "Has ganado<br><br>!Enhorabuena!";
    this.hideDiv("bomb");
  }

  check() {
    if (WORDS.includes(this.wordToTry) && (this.wordToTry.includes(this.randomLetters))) {
      this.checkMsg = "Correcto!";
      clearTimeout(this.timeoutId);
      this.score++;

      this.checkLetters();

      this.win = true;
      KEYBOARD_INITIAL_STATE.forEach(element => this.checkWin(element.state));

      if (this.win == false) {
        this.startGame();
      } else {
        this.playing = false;
        window.localStorage.setItem("win", "YES");
        window.localStorage.setItem("firstTime", "NO");
        window.localStorage.setItem("endedTry", "YES");
        window.localStorage.setItem("nextDay", this.getTomorrowTimestamp());
      }
    } else {
      this.wordToTry = "";
    }
  }

  getLetters(word) {
    this.randomTwoOrThree = Math.floor((Math.random() * (6 - 2)) + 2);

    if (this.randomTwoOrThree == 2) {
      var randomCharAt = Math.floor(Math.random() * (word.length - 1));
      console.log(word.substring((randomCharAt), (randomCharAt + 2)));
      return word.substring((randomCharAt), (randomCharAt + 2));
    } else {
      var randomCharAt = Math.floor(Math.random() * (word.length - 2));
      console.log(word.substring((randomCharAt), (randomCharAt + 3)));
      return word.substring((randomCharAt), (randomCharAt + 3));
    }
  }

  playButton() {
    if (window.localStorage.getItem("lives") > 0) {
      this.showDiv("playButton");
      this.render();
      this.hideDiv("fail");
      this.hideDiv("lives");
      this.hideDiv("bomb");
      this.hideDiv("wordToTry");
      this.hideDiv("score");
      this.startGame();
    }
  }

  startGame() {
    this.playing = true;
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    this.randomWord = WORDS[randomIndex];

    this.timeoutId = setTimeout(() => { this.timeOut(); }, 7000);

    this.getLetters(this.randomWord);

    this.randomTwoOrThree = Math.floor((Math.random() * (4 - 2)) + 2);

    if (this.randomTwoOrThree == 2) {
      var randomCharAt = Math.floor(Math.random() * (this.randomWord.length - 1));
      this.randomLetters = this.randomWord.substring((randomCharAt), (randomCharAt + 2));
    } else {
      var randomCharAt = Math.floor(Math.random() * (this.randomWord.length - 2));
      this.randomLetters = this.randomWord.substring((randomCharAt), (randomCharAt + 3));
    }
    this.wordToTry = "";
    this.render();
    this.hideDiv("playButton");
    this.hideDiv("fail");
    this.drawLives();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${Boomword.styles}</style>
    <div class = "container">
    <div id="lives">
    <img class="heart" id="heart1" >
    <img class="heart" id="heart2" >
    <img class="heart" id="heart3" >
    </div>
    <div id="score">Puntuación: ${this.score}</div>
    <div id="bomb">
      <img class="bombIcon" src="./assets/bomb1.svg" style="width:180px; height:180px;">
      <div id="bombText">${this.randomLetters}</div>
    </div>
    <div id="wordToTry"> ${this.wordToTry}</div>
    <div id="fail">${this.failMsg}</div>
    <div onclick="this.getRootNode().host.playButton()" id="playButton">${this.playButtonText}</div>
    <boomword-keyboard></boomword-keyboard>
    </div>

`;
  }
}
customElements.define("boomword-game", Boomword);
