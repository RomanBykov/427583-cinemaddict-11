import FilmComponent from "../components/film.js";
import FilmDetailsComponent from "../components/film-details.js";
import FilmsListComponent from "../components/films-list.js";
import MostCommentedFilmsComponent from "../components/most-commented-films.js";
import NoDataComponent from "../components/no-data.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import TopRatedFilmsComponent from "../components/top-rated-films.js";
import {render, remove, append} from "../utils/render.js";

const EXTRA_FILM_CARDS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

const renderFilm = (filmsListElement, film) => {
  const escKeydownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(filmDetailsComponent);
      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };

  const closeButtonClickHandler = () => {
    remove(filmDetailsComponent);
  };

  const filmClickHandler = (evt) => {
    const filmElement = filmComponent.getElement();
    const filmPoster = filmElement.querySelector(`.film-card__poster`);
    const filmTitle = filmElement.querySelector(`.film-card__title`);
    const filmComments = filmElement.querySelector(`.film-card__comments`);
    const target = evt.target;

    if (target === filmPoster || target === filmTitle || target === filmComments) {
      append(filmDetailsComponent);
      filmDetailsComponent.setClickHandler(closeButtonClickHandler);
      document.addEventListener(`keydown`, escKeydownHandler);
    }
  };

  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmComponent = new FilmComponent(film);
  filmComponent.setClickHandler(filmClickHandler);

  render(filmsListElement, filmComponent);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._noDataComponent = new NoDataComponent();
  }

  render(films) {
    const container = this._container.getElement();
    const isNodata = films.length === 0;

    if (isNodata) {
      render(container, this._noDataComponent);
      return;
    }

    const filmsListComponent = new FilmsListComponent();
    render(container, filmsListComponent);


    const renderFilms = (place, showingCount, startCount = 0) => {
      films.slice(startCount, showingCount)
        .forEach((film) => {
          renderFilm(place, film);
        });
    };

    let showingFilmCount = SHOWING_FILMS_COUNT_ON_START;

    const renderAllFilms = () => {
      const filmsListContainerElement = container.querySelector(`.films-list__container`);
      renderFilms(filmsListContainerElement, showingFilmCount);

      const showMoreButtonComponent = new ShowMoreButtonComponent();
      render(filmsListComponent.getElement(), showMoreButtonComponent);

      const showMoreButtonClickHandler = () => {
        const prevFilmCount = showingFilmCount;
        showingFilmCount = showingFilmCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        renderFilms(filmsListContainerElement, showingFilmCount, prevFilmCount);

        if (showingFilmCount >= films.length) {
          remove(showMoreButtonComponent);
        }
      };

      showMoreButtonComponent.setClickHandler(showMoreButtonClickHandler);
    };

    const renderExtraFilms = (extraFilmsComponent) => {
      render(container, extraFilmsComponent);

      const filmsListElement = extraFilmsComponent.getElement().querySelector(`.films-list__container`);
      renderFilms(filmsListElement, EXTRA_FILM_CARDS_COUNT);
    };

    renderAllFilms();
    renderExtraFilms(new TopRatedFilmsComponent());
    renderExtraFilms(new MostCommentedFilmsComponent());
  }
}
