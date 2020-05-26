export const reactions = [`sleeping`, `smile`, `puke`, `angry`];

export const commentAuthors = [`John Doe`, `Tim Macoveev`, `Samwell Tarly`, `Uncle Ben`, `Salma Hayek`];

export const comments = [
  `Booooooooooring`,
  `Interesting setting and a good cast`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Very very old. Seriously?`
];

export const userAvatars = [`bitmap@2x.png`];

export const userRatings = [`Movie Buff`];

export const buttonClassNames = {
  [`add-to-watchlist`]: `Add to watchlist`,
  [`mark-as-watched`]: `Mark as watched`,
  [`favorite`]: `Mark as favorite`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const FilterName = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

export const HIDDEN_CLASS = `visually-hidden`;

// TODO: придумать значение получше для ALL
export const Period = {
  ALL: 6365,
  TODAY: 1,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365
};

export const StatFilterType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

export const STAT_FILTER_VALUES = Object.values(StatFilterType);

export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`,
};
