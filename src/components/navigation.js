import AbstractComponent from "./abstract-component.js";

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation"></nav>`
  );
};

export default class Navigation extends AbstractComponent {
  getTemplate() {
    return createNavigationTemplate();
  }
}
