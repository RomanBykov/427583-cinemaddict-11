import AbstractComponent from "./abstract-component.js";

const createFiltersTemplate = (films) => {
  const watchListCount = films.filter((film) => film.isAdded).length;
  const historyCount = films.filter((film) => film.isWatched).length;
  const favoritesCount = films.filter((film) => film.isFavorite).length;

  return (
    `<div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
    </div>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFiltersTemplate(this._films);
  }
}
