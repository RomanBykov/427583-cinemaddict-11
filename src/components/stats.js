import AbstractComponent from "./abstract-component.js";

const createStatsTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__additional">Stats</a>`
  );
};

export default class Stats extends AbstractComponent {
  getTemplate() {
    return createStatsTemplate();
  }
}
