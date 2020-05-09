import FilmsListContainerComponent from "../components/films-list-container.js";
import FilmsListComponent from "../components/films-list.js";
import MostCommentedFilmsComponent from "../components/most-commented-films.js";
import NoDataComponent from "../components/no-data.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedFilmsComponent from "../components/top-rated-films.js";
import {render, remove} from "../utils/render.js";
import MovieController, {Mode as MovieControllerMode} from "./movie.js";

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

export default class PageController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._showedFilmsControllers = [];

    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._noDataComponent = new NoDataComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._mainFilmsListContainerComponent = new FilmsListContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._topRatedFilmsComponent = new TopRatedFilmsComponent();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

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
    const films = this._filmsModel.getFilms();
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderFilms(films.slice(prevFilmCount, this._showingFilmsCount), this._mainFilmsListContainerComponent.getElement());


    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_FILMS_COUNT_ON_START);
  }
}
