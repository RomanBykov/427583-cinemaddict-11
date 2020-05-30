import {getMoviesByFilter} from "../utils/filter";
import {FilterType} from "../const";

export default class Movies {
  constructor() {
    this._movies = [];
    this._comments = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getMoviesAll() {
    return this._movies;
  }

  getWatchedMovies() {
    return this._movies.filter((movie) => movie.userDetails.alreadyWatched);
  }

  getAllComments() {
    return this._comments;
  }

  getCurrentMovieComments(id) {
    return this._comments[id];
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
    this._callHandlers(this._dataChangeHandlers);
  }

  setComments(comments) {
    this._comments = comments;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), movie, this._movies.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }


  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
