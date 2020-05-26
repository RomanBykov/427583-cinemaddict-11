import API from "./api";
import MoviesCountComponent from "./components/movies-count";
import MoviesComponent from "./components/movies";
import FilterController from "./controllers/filter";
import MoviesModel from "./models/movies";
import NavigationComponent from "./components/navigation";
import PageController from "./controllers/page";
import StatsButtonComponent from "./components/stats-button";
import StatisticsController from "./controllers/statistics";
import UserProfileComponent from "./components/user-profile";
import {generateUser} from "./mock/user";
import {render} from "./utils/render";

const AUTHORIZATION = `Basic NJCnjdNdcKLKDCNjkncjkdsnjdnjkcnjkNCJKD=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

let totalMoviesCount = 0;

const api = new API(END_POINT, AUTHORIZATION);

const user = generateUser();
const siteHeaderElement = document.querySelector(`.header`);
const footerMoviesCountElement = document.querySelector(`.footer__statistics`);
const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();
const navigationComponent = new NavigationComponent();
const filterController = new FilterController(navigationComponent.getElement(), moviesModel);
const statsButtonComponent = new StatsButtonComponent();
const moviesComponent = new MoviesComponent();
const pageController = new PageController(moviesComponent, moviesModel, api);


render(siteHeaderElement, new UserProfileComponent(user));
render(siteMainElement, navigationComponent);
filterController.render();
render(navigationComponent.getElement(), statsButtonComponent);
render(siteMainElement, moviesComponent);
pageController.renderLoading();
pageController.renderSort();
pageController.renderMoviesList();


api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    totalMoviesCount = movies.length;

    const statisticsController = new StatisticsController(siteMainElement, moviesModel.getWatchedMovies());
    render(footerMoviesCountElement, new MoviesCountComponent(totalMoviesCount));

    pageController.removeLoading();
    pageController.renderLoadedMovies();
    statisticsController.render();
    statisticsController.hide();

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
  });
