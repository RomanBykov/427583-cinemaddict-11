import FilmsCountComponent from "./components/films-count.js";
import FilmsComponent from "./components/films.js";
import FilterController from "./controllers/filter.js";
import NavigationComponent from "./components/navigation.js";
import StatsButtonComponent from "./components/stats-button.js";
import StatisticsController from "./controllers/statistics.js";
import UserProfileComponent from "./components/user-profile.js";
import PageController from "./controllers/page.js";
import FilmsModel from "./models/movies.js";
import {generateFilms} from "./mock/film.js";
import {generateUser} from "./mock/user.js";
import {render} from "./utils/render.js";

const FILM_CARDS_COUNT = 20;

const user = generateUser();
const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new UserProfileComponent(user));

const films = generateFilms(FILM_CARDS_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const siteMainElement = document.querySelector(`.main`);

const navigationComponent = new NavigationComponent();
render(siteMainElement, navigationComponent);

const filterController = new FilterController(navigationComponent.getElement(), filmsModel);

filterController.render();
const statsButtonComponent = new StatsButtonComponent();
render(navigationComponent.getElement(), statsButtonComponent);

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, filmsModel);
pageController.render();

const statisticsController = new StatisticsController(siteMainElement, filmsModel.getWatchedFilms());
statisticsController.render();
statisticsController.hide();

const footerFilmsCountElement = document.querySelector(`.footer__statistics`);
const totalFilmsCount = films.length;
render(footerFilmsCountElement, new FilmsCountComponent(totalFilmsCount));

statsButtonComponent.setOnClickHandler((evt) => {
  evt.preventDefault();

  if (pageController.isVisible()) {
    pageController.hide();
    statisticsController.show();
  } else {
    pageController.show();
    statisticsController.hide();
  }
});
