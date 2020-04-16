const MAX_DESCRIPTION_LENGTH = 140;

const cutDescription = (description) => {
  return description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…` : description;
};

export const createFilmCardTemplate = (film) => {
  const {
    poster,
    title,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    comments,
    isAdded,
    isWatched,
    isFavorite
  } = film;

  const commentsCount = comments.length;
  const genre = genres[0];
  const release = releaseDate.getFullYear();
  const shortDescription = cutDescription(description);

  const toggleActiveClass = (isActive) => {
    return isActive ? `film-card__controls-item--active` : ``;
  };

  const addedActiveClass = toggleActiveClass(isAdded);
  const watchedActiveClass = toggleActiveClass(isWatched);
  const favoriteActiveClass = toggleActiveClass(isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${release}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${addedActiveClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedActiveClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteActiveClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};
