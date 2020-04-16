import {createUserProfileTemplate} from "./components/user-profile";
import {createMenuTemplate} from "./components/menu";
import {createSortTemplate} from "./components/sort";
import {createFilmsContentTemplate} from "./components/films-content";
import {createFilmsListTemplate} from "./components/films-list";
import {createFilmCardTemplate} from "./components/film-card";
import {createShowMoreBtnTemplate} from "./components/show-more-btn";
import {createTopRatedFilmsListTemplate} from "./components/top-rated";
import {createMostCommentedFilmsListTemplate} from "./components/most-commented";
import {createFooterStatisticsTemplate} from "./components/footer-statistics";
import {createFilmDetailsTemplate} from "./components/film-details";
import {generateFilms} from "./mock/film";

const FILM_CARDS_COUNT = 20;
const EXTRA_FILM_CARDS_COUNT = 2;

const films = generateFilms(FILM_CARDS_COUNT);
const totalFilmsCount = films.length;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createMenuTemplate(films));
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsContentTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
render(filmsElement, createFilmsListTemplate());

const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);


const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

let showingFilmCount = SHOWING_FILMS_COUNT_ON_START;

const renderFilms = (showingCount, container, prevCount = 0) => {
  films.slice(prevCount, showingCount).forEach((film) => {
    render(container, createFilmCardTemplate(film));
  });
};

renderFilms(showingFilmCount, filmsListContainerElement);

const filmsListElement = filmsElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreBtnTemplate());

const showMoreBtnElement = filmsListElement.querySelector(`.films-list__show-more`);

showMoreBtnElement.addEventListener(`click`, () => {
  const prevFilmCount = showingFilmCount;
  showingFilmCount = showingFilmCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  renderFilms(showingFilmCount, filmsListContainerElement, prevFilmCount);

  if (showingFilmCount >= films.length) {
    showMoreBtnElement.remove();
  }
});

render(filmsElement, createTopRatedFilmsListTemplate());
render(filmsElement, createMostCommentedFilmsListTemplate());

const extraFilmsListElements = filmsElement.querySelectorAll(`.films-list--extra`);

extraFilmsListElements.forEach((extraFilmsList) => {
  const extraFilmsListContainerElement = extraFilmsList.querySelector(`.films-list__container`);

  renderFilms(EXTRA_FILM_CARDS_COUNT, extraFilmsListContainerElement);
});

const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, createFooterStatisticsTemplate(totalFilmsCount));

const siteBodyElement = document.querySelector(`body`);

render(siteBodyElement, createFilmDetailsTemplate(films[0]));

const filmDetailsElement = siteBodyElement.querySelector(`.film-details`);
const closeDetailsBtnElement = filmDetailsElement.querySelector(`.film-details__close-btn`);

filmDetailsElement.style.display = `none`;

const hideDetails = () => {
  filmDetailsElement.style.display = `none`;
  siteBodyElement.classList.remove(`hide-overflow`);
};

const closeDetailsBtnClickHandler = () => {
  hideDetails();
  closeDetailsBtnElement.removeEventListener(`click`, closeDetailsBtnClickHandler);
};

const showDetails = () => {
  siteBodyElement.classList.add(`hide-overflow`);
  filmDetailsElement.style.display = `block`;
  closeDetailsBtnElement.addEventListener(`click`, closeDetailsBtnClickHandler);
};

document.addEventListener(`click`, (evt) => {
  const target = evt.target;

  if (target.classList.contains(`film-card__poster`)) {
    showDetails();
  }
});
