import {createElement} from "../util.js";

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation"></nav>`
  );
};

export default class Navigation {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate();
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
