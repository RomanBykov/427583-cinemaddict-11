import {createElement} from "../util.js";

const createStatsTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__additional">Stats</a>`
  );
};

export default class Stats {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
