import AbstractComponent from "./abstract-component.js";

const createTopRatedFilmsTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`
  );
};

export default class TopRatedFilms extends AbstractComponent {
  getTemplate() {
    return createTopRatedFilmsTemplate();
  }
}
