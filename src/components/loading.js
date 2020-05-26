import AbstractComponent from "./abstract-component";

const createLoadingTemplate = () => {
  return (
    `<h2 class="films-list__title">Loading...</h2>`
  );
};

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
