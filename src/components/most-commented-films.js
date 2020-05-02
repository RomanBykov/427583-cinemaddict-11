import AbstractComponent from "./abstract-component.js";

const createMostCommentedFilmsTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>`
  );
};

export default class MostCommentedFilms extends AbstractComponent {
  getTemplate() {
    return createMostCommentedFilmsTemplate();
  }
}
