import AbstractComponent from "./abstract-component";

const createMoviesListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class MoviesListContainer extends AbstractComponent {
  getTemplate() {
    return createMoviesListContainerTemplate();
  }
}
