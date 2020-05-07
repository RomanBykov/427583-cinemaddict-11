import FilmsCountComponent from "./components/films-count.js";
import FilmsComponent from "./components/films.js";
import FilterController from "./controllers/filter.js";
import NavigationComponent from "./components/navigation.js";
import SortComponent from "./components/sort.js";
import StatsComponent from "./components/stats.js";
import UserProfileComponent from "./components/user-profile.js";
import PageController from "./controllers/page.js";
import FilmsModel from "./models/movies.js";
import CommentsModel from "./models/comments.js";
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
render(navigationComponent.getElement(), new StatsComponent());
render(siteMainElement, new SortComponent());

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent);

const pageController = new PageController(filmsComponent, filmsModel);
pageController.render();

const footerFilmsCountElement = document.querySelector(`.footer__statistics`);
const totalFilmsCount = films.length;
render(footerFilmsCountElement, new FilmsCountComponent(totalFilmsCount));
