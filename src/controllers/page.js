import FilmsListContainerComponent from "../components/films-list-container";
import FilmsListComponent from "../components/films-list";
import MostCommentedFilmsComponent from "../components/most-commented-films";
import NoDataComponent from "../components/no-data";
import ShowMoreButtonComponent from "../components/show-more-button";
import TopRatedFilmsComponent from "../components/top-rated-films";
import SortComponent, {SortType} from "../components/sort";
import {render, remove} from "../utils/render";
import MovieController, {Mode as MovieControllerMode} from "./movie";

const EXTRA_FILM_CARDS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

const renderFilms = (container, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(film, MovieControllerMode.DEFAULT);

    return movieController;
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};


export default class PageController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._showedFilmsControllers = [];

    this._isVisible = true;

    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._noDataComponent = new NoDataComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._mainFilmsListContainerComponent = new FilmsListContainerComponent();
    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._topRatedFilmsComponent = new TopRatedFilmsComponent();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    this._films = this._filmsModel.getFilms();
    const isNodata = this._films.length === 0;

    if (isNodata) {
      render(container, this._noDataComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._filmsListComponent);

    const renderMainFilms = () => {
      render(this._filmsListComponent.getElement(), this._mainFilmsListContainerComponent);
      this._renderFilms(this._films.slice(0, this._showingFilmsCount), this._mainFilmsListContainerComponent.getElement());
      this._renderShowMoreButton();
    };

    renderMainFilms();

    const renderTopRatedFilms = () => {
      const topRatedFilmsContainerComponent = new FilmsListContainerComponent();

      render(container, this._topRatedFilmsComponent);
      render(this._topRatedFilmsComponent.getElement(), topRatedFilmsContainerComponent);

      renderFilms(
          topRatedFilmsContainerComponent.getElement(),
          this._films.slice(0, EXTRA_FILM_CARDS_COUNT),
          this._onDataChange,
          this._onViewChange
      );
    };

    const renderMostCommentedFilms = () => {
      const mostCommentedFilmsContainerComponent = new FilmsListContainerComponent();

      render(container, this._mostCommentedFilmsComponent);
      render(this._mostCommentedFilmsComponent.getElement(), mostCommentedFilmsContainerComponent);

      renderFilms(
          mostCommentedFilmsContainerComponent.getElement(),
          this._films.slice(0, EXTRA_FILM_CARDS_COUNT),
          this._onDataChange,
          this._onViewChange
      );
    };

    renderTopRatedFilms();
    renderMostCommentedFilms();
  }

  isVisible() {
    return this._isVisible;
  }

  _toggleVisibility() {
    this._isVisible = !this._isVisible;
  }

  _removeFilms() {
    this._showedFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmsControllers = [];
  }

  _renderFilms(films, container) {
    const newFilms = renderFilms(container, films, this._onDataChange, this._onViewChange);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._showingFilmsCount = this._showedFilmsControllers.length;
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    const filmsListComponent = this._filmsListComponent.getElement();
    render(filmsListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count), this._mainFilmsListContainerComponent.getElement());
    this._renderShowMoreButton();
  }

  _onDataChange(movieController, oldData, newData) {
    const isSucces = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSucces) {
      movieController.render(newData);
    }
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((film) => {
      film.setDefaultView();
    });
  }

  _onShowMoreButtonClick() {
    const prevFilmCount = this._showingFilmsCount;
    const sortType = this._sortComponent.getSortType();
    const films = this._filmsModel.getFilms();
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedFilms = getSortedFilms(films, sortType, prevFilmCount, this._showingFilmsCount);

    this._renderFilms(sortedFilms, this._mainFilmsListContainerComponent.getElement());

    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onSortTypeChange(sortType) {
    const films = this._filmsModel.getFilms();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(films, sortType, 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms, this._mainFilmsListContainerComponent.getElement());

    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_FILMS_COUNT_ON_START);
  }

  show() {
    this._container.show();
    this._toggleVisibility();
  }

  hide() {
    this._container.hide();
    this._toggleVisibility();
  }
}
