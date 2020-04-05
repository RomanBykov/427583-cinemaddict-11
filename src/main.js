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

const FILM_CARDS_COUNT = 5;
const EXTRA_FILM_CARDS_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createMenuTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsContentTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
render(filmsElement, createFilmsListTemplate());

const fimlsListContainerElement = filmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARDS_COUNT; i++) {
  render(fimlsListContainerElement, createFilmCardTemplate());
}

const showMoreBtnElement = filmsElement.querySelector(`.films-list`);
render(showMoreBtnElement, createShowMoreBtnTemplate());

render(filmsElement, createTopRatedFilmsListTemplate());
render(filmsElement, createMostCommentedFilmsListTemplate());

const extraFilmsListElements = filmsElement.querySelectorAll(`.films-list--extra`);

extraFilmsListElements.forEach((it) => {
  const extraFilmsListContainerElement = it.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_FILM_CARDS_COUNT; i++) {
    render(extraFilmsListContainerElement, createFilmCardTemplate());
  }
});

const siteFooterElement = document.querySelector(`.footer`);
const footerStatisticsElement = siteFooterElement.querySelector(`.footer__statistics`);

render(footerStatisticsElement, createFooterStatisticsTemplate());

const siteBodyElement = document.querySelector(`body`);

render(siteBodyElement, createFilmDetailsTemplate());

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
