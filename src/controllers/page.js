import FilmsListContainerComponent from "../components/films-list-container.js";
import FilmsListComponent from "../components/films-list.js";
import MostCommentedFilmsComponent from "../components/most-commented-films.js";
import NoDataComponent from "../components/no-data.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedFilmsComponent from "../components/top-rated-films.js";
import {render, remove} from "../utils/render.js";
import MovieController from "./movie.js";

const EXTRA_FILM_CARDS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

const renderFilms = (container, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(film);

    return movieController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noDataComponent = new NoDataComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._mainFilmsListContainerComponent = new FilmsListContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._topRatedFilmsComponent = new TopRatedFilmsComponent();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsComponent();

    this._films = [];
    this._showedFilmsControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  }

  render(films) {
    this._films = films;
    const container = this._container.getElement();
    const isNodata = films.length === 0;

    if (isNodata) {
      render(container, this._noDataComponent);
      return;
    }

    render(container, this._filmsListComponent);

    const renderMainFilms = () => {
      render(this._filmsListComponent.getElement(), this._mainFilmsListContainerComponent);

      const newFilms = renderFilms(
          this._mainFilmsListContainerComponent.getElement(),
          this._films.slice(0, this._showingFilmsCount),
          this._onDataChange,
          this._onViewChange
      );

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

      this._renderShowMoreButton();
    };

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

    renderMainFilms();
    renderTopRatedFilms();
    renderMostCommentedFilms();
  }

  _renderShowMoreButton() {
    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    const showMoreButtonClickHandler = () => {
      const prevFilmCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const newFilms = renderFilms(
          this._mainFilmsListContainerComponent.getElement(),
          this._films.slice(prevFilmCount, this._showingFilmsCount),
          this._onDataChange,
          this._onViewChange
      );

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    };

    const filmsListComponent = this._filmsListComponent.getElement();

    render(filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(showMoreButtonClickHandler);
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    this._showedFilmsControllers[index].render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((film) => {
      film.setDefaultView();
    });
  }
}
