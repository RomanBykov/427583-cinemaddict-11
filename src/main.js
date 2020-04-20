import FilmComponent from "./components/film.js";
import FilmDetailsComponent from "./components/film-details.js";
import FilmsCountComponent from "./components/films-count.js";
import FilmsComponent from "./components/films.js";
import FilmsListComponent from "./components/films-list.js";
import FiltersComponent from "./components/filters.js";
import MostCommentedFilmsComponent from "./components/most-commented-films.js";
import NavigationComponent from "./components/navigation.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import SortComponent from "./components/sort.js";
import StatsComponent from "./components/stats.js";
import TopRatedFilmsComponent from "./components/top-rated-films.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilms} from "./mock/film.js";
import {generateUser} from "./mock/user.js";
import {render} from "./util.js";

const FILM_CARDS_COUNT = 20;
const EXTRA_FILM_CARDS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

const renderFilm = (filmsListContainerElement, film) => {
  const openFilmDetails = () => {
    const siteBody = document.querySelector(`body`);
    siteBody.appendChild(filmDetailsComponent.getElement());
  };

  const onFilmClick = (evt) => {
    const filmPoster = filmComponent.getElement().querySelector(`.film-card__poster`);
    const filmTitle = filmComponent.getElement().querySelector(`.film-card__title`);
    const filmComments = filmComponent.getElement().querySelector(`.film-card__comments`);
    const target = evt.target;

    if (target === filmPoster || target === filmTitle || target === filmComments) {
      openFilmDetails();
    }
  };

  const onCloseButtonClick = () => {
    const siteBody = document.querySelector(`body`);
    const filmDetailsElement = siteBody.querySelector(`.film-details`);
    siteBody.removeChild(filmDetailsElement);
  };

  const filmDetailsComponent = new FilmDetailsComponent(film);
  const closeDetailsButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  closeDetailsButton.addEventListener(`click`, onCloseButtonClick);

  const filmComponent = new FilmComponent(film);
  filmComponent.getElement().addEventListener(`click`, onFilmClick);
  render(filmsListContainerElement, filmComponent.getElement());
};

const renderFilms = (place, showingCount, startCount = 0) => {
  films.slice(startCount, showingCount)
    .forEach((film) => {
      renderFilm(place, film);
    });
};

const renderAllFilms = (filmsComponent, films) => {
  render(filmsComponent.getElement(), new FilmsListComponent().getElement());
  const filmsListContainerElement = filmsComponent.getElement().querySelector(`.films-list__container`);

  let showingFilmCount = SHOWING_FILMS_COUNT_ON_START;
  renderFilms(filmsListContainerElement, showingFilmCount);

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(filmsComponent.getElement(), showMoreButtonComponent.getElement());

  const onShowMoreButtonClick = () => {
    const prevFilmCount = showingFilmCount;
    showingFilmCount = showingFilmCount + SHOWING_TASKS_COUNT_BY_BUTTON;
    renderFilms(filmsListContainerElement, showingFilmCount, prevFilmCount);

    if (showingFilmCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  };

  showMoreButtonComponent.getElement().addEventListener(`click`, onShowMoreButtonClick);
};

const renderExtraFilms = (filmsComponent, extraFilmsComponent) => {
  render(filmsComponent.getElement(), extraFilmsComponent.getElement());

  const filmsListContainerElement = extraFilmsComponent.getElement().querySelector(`.films-list__container`);
  renderFilms(filmsListContainerElement, EXTRA_FILM_CARDS_COUNT);
};

const user = generateUser();
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserProfileComponent(user).getElement());

const renderNavigation = (navigationComponent, films) => {
  render(navigationComponent.getElement(), new FiltersComponent(films).getElement());
  render(navigationComponent.getElement(), new StatsComponent().getElement());
};

const films = generateFilms(FILM_CARDS_COUNT);
const siteMainElement = document.querySelector(`.main`);

const navigationComponent = new NavigationComponent();
render(siteMainElement, navigationComponent.getElement());

renderNavigation(navigationComponent, films);
render(siteMainElement, new SortComponent().getElement());

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent.getElement());

renderAllFilms(filmsComponent, films);
renderExtraFilms(filmsComponent, new TopRatedFilmsComponent());
renderExtraFilms(filmsComponent, new MostCommentedFilmsComponent());

const totalFilmsCount = films.length;
const footerFilmsCountElement = document.querySelector(`.footer__statistics`);
render(footerFilmsCountElement, new FilmsCountComponent(totalFilmsCount).getElement());
