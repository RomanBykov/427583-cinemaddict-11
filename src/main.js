import FilmsCountComponent from "./components/films-count.js";
import FilmsComponent from "./components/films.js";
import FiltersComponent from "./components/filters.js";
import NavigationComponent from "./components/navigation.js";
import SortComponent from "./components/sort.js";
import StatsComponent from "./components/stats.js";
import UserProfileComponent from "./components/user-profile.js";
import PageController from "./controllers/page.js";
import {generateFilms} from "./mock/film.js";
import {generateUser} from "./mock/user.js";
import {render} from "./utils/render.js";

const FILM_CARDS_COUNT = 20;

const user = generateUser();
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserProfileComponent(user));

const renderNavigation = (navigationComponent, films) => {
  render(navigationComponent, new FiltersComponent(films));
  render(navigationComponent, new StatsComponent());
};

const films = generateFilms(FILM_CARDS_COUNT);
const siteMainElement = document.querySelector(`.main`);

const navigationComponent = new NavigationComponent();
render(siteMainElement, navigationComponent);

renderNavigation(navigationComponent.getElement(), films);
render(siteMainElement, new SortComponent());

const filmsComponent = new FilmsComponent();
const pageController = new PageController(filmsComponent);
render(siteMainElement, filmsComponent);
pageController.render(films);

const footerFilmsCountElement = document.querySelector(`.footer__statistics`);
const totalFilmsCount = films.length;
render(footerFilmsCountElement, new FilmsCountComponent(totalFilmsCount));
