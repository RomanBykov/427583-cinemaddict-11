import AbstractComponent from "./abstract-component.js";

const createMoviesListTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
  );
};

export default class MoviesList extends AbstractComponent {
  getTemplate() {
    return createMoviesListTemplate();
  }
}
