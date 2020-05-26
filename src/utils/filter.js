import {FilterType, StatFilterType} from "../const";

export const getHistoryMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.alreadyWatched);
};

export const getNotHistoryMovies = (movies) => {
  return movies.filter((movie) => !movie.userDetails.alreadyWatched);
};

export const getFavoriteMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.favorite);
};

export const getWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.userDetails.watchlist);
};

export const getMoviesByFilter = (movies, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return movies;
    case FilterType.HISTORY:
      return getHistoryMovies(movies);
    case FilterType.WATCHLIST:
      return getWatchlistMovies(movies);
    case FilterType.FAVORITES:
      return getFavoriteMovies(movies);
  }

  return movies;
};

export const getStatsFilterName = (filterName) => {
  let name = ``;

  switch (filterName) {
    case StatFilterType.ALL:
      name = `All time`;
      break;
    case StatFilterType.TODAY:
      name = `Today`;
      break;
    case StatFilterType.WEEK:
      name = `Week`;
      break;
    case StatFilterType.MONTH:
      name = `Month`;
      break;
    case StatFilterType.YEAR:
      name = `Year`;
      break;
  }

  return name;
};
