import {formatCommentDate, formateReleaseDate} from "../utils/common";
import AbstractSmartComponent from "./abstract-smart-component";
import {encode} from "he";

const SHAKE_ANIMATION_TIMEOUT = 600;

const createCommentsMarkup = (comments) => {
  return comments.map((commentItem) => {

    const {id, emotion, author, date, comment: rawComment} = commentItem;

    const commentDate = formatCommentDate(date);
    const comment = encode(rawComment);

    return (
      `<li class="film-details__comment" data-id="${id}">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  }).join(`\n`);
};

const createGenresMarkup = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  }).join(`\n`);
};

const createMovieDetailsTemplate = (movie, viewersComments) => {
  const {
    poster,
    title,
    originalTitle,
    rating,
    releaseDate,
    duration,
    genres,
    description,
    rated,
    director,
    actors,
    writers,
    country,
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    },
  } = movie;
  const {comments} = viewersComments;

  const commentsCount = comments.length;
  const commentsMarkup = createCommentsMarkup(comments);
  const genresMarkup = createGenresMarkup(genres);
  const release = formateReleaseDate(releaseDate);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${rated}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${release}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">${genresMarkup}</td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="watchlist"
              name="watchlist"
              ${watchlist ? `checked` : ``}
            >
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="watched"
              name="watched"
              ${alreadyWatched ? `checked` : ``}
            >
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input
              type="checkbox"
              class="film-details__control-input visually-hidden"
              id="favorite"
              name="favorite"
              ${favorite ? `checked` : ``}
            >
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetails extends AbstractSmartComponent {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._userDetails = this._movie.userDetails;
    this._watchlist = this._userDetails.watchlist;
    this._alreadyWatched = this._userDetails.alreadyWatched;
    this._watchingDate = this._userDetails.watchingDate;
    this._favorite = this._userDetails.favorite;
    this._comments = comments;

    this._closeClickHandler = null;
    this._deleteCommentClickHandler = null;
    this._addCommentSubmitHandler = null;
    this._onEmojiChange = null;


    this.setEmojiChangeHandler();
  }

  getTemplate() {
    return createMovieDetailsTemplate(this._movie, {
      userDetails: {
        watchlist: this._watchlist,
        alreadyWatched: this._alreadyWatched,
        watchingDate: this._watchingDate,
        favorite: this._favorite,
      },
      comments: this._comments,
    });
  }

  updateComments(comments) {
    this._comments = comments;
  }

  recoveryListeners() {
    this.setCloseClickHandler(this._closeClickHandler);
    this.setCommentDeleteClickHandler(this._deleteCommentClickHandler);
    this.setCommentSubmitHandler(this._addCommentSubmitHandler);
    this.setEmojiChangeHandler(this._onEmojiChange);
  }

  setCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._closeClickHandler = handler;
  }

  setEmojiChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, handler);

    this._onEmojiChange = handler;
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
  }

  setAddToWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
  }

  setAddToFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
  }

  setCommentDeleteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, handler);

    this._deleteCommentClickHandler = handler;
  }

  setCommentSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, handler);

    this._addCommentSubmitHandler = handler;
  }

  disableForm(isDisabled) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .disabled = isDisabled;
  }

  shake(id = null) {
    const element = id ? this.getElement().querySelector(`.film-details__comment[data-id="${id}"]`) : this.getElement();
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
