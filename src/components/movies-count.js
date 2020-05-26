import AbstractComponent from "./abstract-component";

const createMovieCountTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class MoviesCount extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createMovieCountTemplate(this._count);
  }
}
