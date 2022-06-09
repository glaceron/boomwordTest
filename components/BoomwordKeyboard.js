import KEYBOARD_INITIAL_STATE from "../assets/keyboardState.json";

class BoomwordKeyboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.letters = KEYBOARD_INITIAL_STATE;
  }

  static get styles() {
    return /* css */`
      :host {
        position: fixed;
        bottom: 0;
        --exact-color: Green;
        --unused-color: darkgrey;
        --blocked-color: rgb(115, 115, 115);
      }
      .container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 6px 3px;
        width: 380px;
        margin: 1em 0;
      }
      .letter {
        background: var(--unused-color);
        color: #fff;
        font-family: Arial;
        font-weight: bold;
        padding: 14px 10px;
        border-radius: 3px;
        width: 12px;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }
      .letter.special {
        width: 32px;
        background: var(--blocked-color);
      }
      .letter.mark {
        width: 47px;
        background: var(--blocked-color);
      }
      .letter.exactMark {
        width: 47px;
        background: var(--blocked-color);
      }
      .letter.exact {
        background: var(--exact-color);
        color: #fff;
      }
      .letter.unusedSpecial {
        width: 12px;
        background: var(--blocked-color);
      }
      .letter.specialMark {
        width: 12px;
        background: var(--blocked-color);
      }

    `;
  }

  setLetter(key, state) {
    const letter = this.letters.find(letter => letter.key === key);
    if (letter.state !== "exact") {
      letter.state = state;
    }
    this.render();
  }

  listeners() {
    const keys = Array.from(this.shadowRoot.querySelectorAll(".letter"));
    keys.forEach(key => {
      key.addEventListener("click", () => {
        const detail = key.textContent.replace("INTRO", "Enter").replace("BACK", "Backspace");
        const options = { detail, bubbles: true, composed: true };
        const event = new CustomEvent("keyboard", options);
        this.dispatchEvent(event);
      });
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${BoomwordKeyboard.styles}</style>
    <div class="container">
      ${this.letters.map(letter => `<div class="letter ${letter.state}">${letter.key}</div>`).join("")}
    </div>`;
    this.listeners();
  }
}

customElements.define("boomword-keyboard", BoomwordKeyboard);
