import AbstractComponent from "./abstract-component";
import {SortType} from "../const";

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeDefault() {
    this.getElement().querySelectorAll(`.sort__button`)
      .forEach((type) => type.matches(`[data-sort-type="${SortType.DEFAULT}"]`) ?
        type.classList.add(`sort__button--active`) : type.classList.remove(`sort__button--active`));
  }

  setSortTypeChangeHandler(handler) {
    const sortElement = this.getElement();
    const sortButtons = sortElement.querySelectorAll(`.sort__button`);

    sortElement.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (target.tagName !== `A`) {
        return;
      }

      const sortType = target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      sortButtons.forEach((it) => {
        if (it === target) {
          return it.classList.add(`sort__button--active`);
        }

        return it.classList.remove(`sort__button--active`);
      });

      handler(this._currentSortType);
    });
  }
}
