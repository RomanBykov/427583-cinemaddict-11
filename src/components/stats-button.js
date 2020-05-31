import AbstractComponent from "./abstract-component";

const createStatsButtonTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__additional">Stats</a>`
  );
};

export default class StatsButton extends AbstractComponent {
  getTemplate() {
    return createStatsButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
