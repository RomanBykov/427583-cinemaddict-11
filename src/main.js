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
import {render} from "./utils/render";
import {getUserRank} from "./utils/common";

const AUTHORIZATION = `Basic NJCnjdNdcKLKDCNjkncjkdsnjdnjkcnjkNCJKD=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict/`;

let totalMoviesCount = 0;

const api = new API(END_POINT, AUTHORIZATION);

const siteHeaderElement = document.querySelector(`.header`);
const footerMoviesCountElement = document.querySelector(`.footer__statistics`);
const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();
const navigationComponent = new NavigationComponent();
const filterController = new FilterController(navigationComponent.getElement(), moviesModel);
const statsButtonComponent = new StatsButtonComponent();
const moviesComponent = new MoviesComponent();
const pageController = new PageController(moviesComponent, moviesModel, api);


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

    const watchedMovies = moviesModel.getWatchedMovies();
    const userRank = getUserRank(watchedMovies.length);

    const statisticsController = new StatisticsController(siteMainElement, moviesModel.getWatchedMovies(), userRank);
    render(footerMoviesCountElement, new MoviesCountComponent(totalMoviesCount));
    render(siteHeaderElement, new UserProfileComponent(userRank));

    pageController.removeLoading();
    pageController.renderLoadedMovies();
    pageController.setStatisticsController(statisticsController);
    statisticsController.render();
    statisticsController.hide();

    statsButtonComponent.setClickHandler((evt) => {
      evt.preventDefault();

      if (pageController.isVisible()) {
        pageController.hide();
        statisticsController.show();
      }
    });
  });
