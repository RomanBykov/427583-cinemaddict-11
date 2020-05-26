import AbstractComponent from "./abstract-component";
import {FilterType, FilterName} from "../const";

const createFilterMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const filterName = FilterName[name.toUpperCase()];

  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
      ${filterName} ${name === FilterType.ALL ? `` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.isActive)).join(`\n`);

  return (
    `<div class="main-navigation__items">
      ${filtersMarkup}
    </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterName = evt.target.href.split(`#`)[1];

      handler(filterName);
    });
  }
}
