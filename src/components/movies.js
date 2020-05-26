import AbstractComponent from "./abstract-component";

const createMoviesTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Movies extends AbstractComponent {
  getTemplate() {
    return createMoviesTemplate();
  }
}
