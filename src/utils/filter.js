import {FilterType, StatFilterType} from "../const.js";

export const getHistoryFilms = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched);
};

export const getNotHistoryFilms = (films) => {
  return films.filter((film) => !film.userDetails.alreadyWatched);
};

export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.userDetails.favorite);
};

export const getWatchlistFilms = (films) => {
  return films.filter((film) => film.userDetails.watchlist);
};

export const getFilmsByFilter = (films, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.FAVORITES:
      return getFavoriteFilms(films);
  }

  return films;
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
