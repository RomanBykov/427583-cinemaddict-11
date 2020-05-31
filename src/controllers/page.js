import LoadingComponent from "../components/loading";
import MovieController from "./movie";
import MoviesListContainerComponent from "../components/movies-list-container";
import MoviesListComponent from "../components/movies-list";
import NoDataComponent from "../components/no-data";
import ShowMoreButtonComponent from "../components/show-more-button";
import SortComponent, {} from "../components/sort";
import {render, remove} from "../utils/render";
import {Mode as MovieControllerMode, SortType, StatsMode} from "../const";

const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_MOVIES_COUNT_BY_BUTTON = 5;

const renderMovies = (container, movies, onDataChange, onViewChange, api) => {
  return movies.map((movie) => {
    const movieController = new MovieController(container, onDataChange, onViewChange, api);
    movieController.render(movie, MovieControllerMode.DEFAULT);

    return movieController;
  });
};

const getSortedMovies = (movies, sortType, from, to) => {
  let sortedMovies = [];
  const showingMovies = movies.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedMovies = showingMovies.sort((a, b) => parseInt(b.releaseDate, 10) - parseInt(a.releaseDate, 10));
      break;
    case SortType.RATING:
      sortedMovies = showingMovies.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies.slice(from, to);
};


export default class Page {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;
    this._mode = MovieControllerMode.DEFAULT;

    this._showedMoviesControllers = [];

    this._currentMovieController = null;

    this._isVisible = true;

    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    this._noDataComponent = new NoDataComponent();
    this._moviesListComponent = new MoviesListComponent();
    this._mainMoviesListContainerComponent = new MoviesListContainerComponent();
    this._sortComponent = new SortComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._loadingComponent = new LoadingComponent();
    this._statisticsController = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  setStatisticsController(statsController) {
    this._statisticsController = statsController;
  }

  isVisible() {
    return this._isVisible;
  }

  renderLoading() {
    render(this._moviesListComponent.getElement(), this._loadingComponent);
  }

  removeLoading() {
    remove(this._loadingComponent);
  }

  renderSort() {
    render(this._container.getElement(), this._sortComponent);
  }

  renderMoviesList() {
    render(this._container.getElement(), this._moviesListComponent);
  }

  renderLoadedMovies() {
    const container = this._container.getElement();
    const movies = this._moviesModel.getMovies();
    const isNodata = movies.length === 0;

    if (isNodata) {
      render(container, this._noDataComponent);
      return;
    }

    render(this._moviesListComponent.getElement(), this._mainMoviesListContainerComponent);
    this._renderMovies(movies.slice(0, this._showingMoviesCount), this._mainMoviesListContainerComponent.getElement());
    this._renderShowMoreButton();
  }

  show() {
    this._container.show();
    this._toggleVisibility();
    this._updateMovies(SHOWING_MOVIES_COUNT_ON_START);
    this._sortComponent.setSortTypeDefault();
  }

  hide() {
    this._container.hide();
    this._toggleVisibility();
  }

  _toggleVisibility() {
    this._isVisible = !this._isVisible;
  }

  _removeMovies() {
    this._showedMoviesControllers.forEach((movieController) => movieController.destroy());
    this._showedMoviesControllers = [];
  }

  _renderMovies(movies, container) {
    const newMovies = renderMovies(container, movies, this._onDataChange, this._onViewChange, this._api);
    this._showedMoviesControllers = this._showedMoviesControllers.concat(newMovies);
    this._showingMoviesCount = this._showedMoviesControllers.length;
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingMoviesCount >= this._moviesModel.getMovies().length) {
      return;
    }

    const moviesListComponent = this._moviesListComponent.getElement();
    render(moviesListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _updateMovies(count) {
    const sortType = this._sortComponent.getSortType();
    const movies = this._moviesModel.getMovies();
    this._showingMoviesCount = count;
    const sortedMovies = getSortedMovies(movies, sortType, 0, this._showingMoviesCount);

    this._removeMovies();
    this._renderMovies(sortedMovies, this._mainMoviesListContainerComponent.getElement());
    this._renderShowMoreButton();
  }

  _onDataChange(movieController, oldData, newData) {
    this._mode = movieController.getMode();

    this._currentMovieController = movieController;
    this._api.updateMovie(oldData.id, newData)
      .then((updatedData) => {
        const isSuccess = this._moviesModel.updateMovie(oldData.id, updatedData);

        if (isSuccess) {
          this._updateMovies(this._showingMoviesCount);
          movieController.render(updatedData, this._mode);
          const newWatchedMovies = this._moviesModel.getWatchedMovies();
          this._statisticsController.updateMovies(newWatchedMovies);
        }
      });
  }

  _onViewChange() {
    if (this._currentMovieController) {
      this._currentMovieController.setDefaultView();
    }

    this._showedMoviesControllers.forEach((movie) => {
      movie.setDefaultView();
    });
  }

  _onShowMoreButtonClick() {
    const prevMoviesCount = this._showingMoviesCount;
    const sortType = this._sortComponent.getSortType();
    const movies = this._moviesModel.getMovies();
    this._showingMoviesCount = this._showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;

    const sortedMovies = getSortedMovies(movies, sortType, prevMoviesCount, this._showingMoviesCount);

    this._renderMovies(sortedMovies, this._mainMoviesListContainerComponent.getElement());

    if (this._showingMoviesCount >= movies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onSortTypeChange(sortType) {
    const movies = this._moviesModel.getMovies();
    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    const sortedMovies = getSortedMovies(movies, sortType, 0, this._showingMoviesCount);

    this._removeMovies();
    this._renderMovies(sortedMovies, this._mainMoviesListContainerComponent.getElement());

    this._renderShowMoreButton();
  }

  _onFilterChange() {
    if (this._statisticsController.getMode() === StatsMode.SHOWED) {
      this._statisticsController.hide();
      this.show();
    }
    this._updateMovies(SHOWING_MOVIES_COUNT_ON_START);
  }
}
