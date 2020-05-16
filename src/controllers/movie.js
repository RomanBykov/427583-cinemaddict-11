import FilmDetailsComponent from "../components/film-details.js";
import FilmComponent from "../components/film.js";
import EmojiComponent from "../components/emoji.js";
import {remove, append, render, clearElement, replace} from "../utils/render.js";
import {commentAuthors, reactions} from "../const.js";
import {getRandomArrayItem} from "../utils/common.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._viewersComments = [];
    this._commentEmoji = reactions[0];

    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._closeDetailsPopup = this._closeDetailsPopup.bind(this);
  }

  render(film, mode) {
    this._mode = mode;
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._viewersComments = film.comments;

    const onAddToWatchlistDetails = () => {
      this._onDataChange(this, film, Object.assign({}, film, film.userDetails.watchlist = !film.userDetails.watchlist));
    };

    const onAddToWatchedButtonClick = () => {
      this._onDataChange(this, film, Object.assign({}, film,
          film.userDetails.alreadyWatched = !film.userDetails.alreadyWatched,
          film.userDetails.watchingDate = new Date()
      ));
    };

    const onAddToFavoriteButtonClick = () => {
      this._onDataChange(this, film, Object.assign({}, film, film.userDetails.favorite = !film.userDetails.favorite));
    };

    const subscribeOnEvents = (component) => {
      component.setAddToWatchlistClickHandler(onAddToWatchlistDetails);
      component.setAddToWatchedClickHandler(onAddToWatchedButtonClick);
      component.setAddToFavoriteClickHandler(onAddToFavoriteButtonClick);
    };

    subscribeOnEvents(this._filmComponent);

    this._filmComponent.setOpenDetailsClickHandler((evt) => {
      if (evt.target.tagName === `BUTTON`) {
        return;
      }
      openDetailsPopup();
    });

    const onEmojiChange = (evt) => {
      if (evt.target.matches(`.film-details__emoji-item`)) {
        const emoji = evt.target.value;
        this._commentEmoji = emoji;

        const commentEmojiELement = this._filmDetailsComponent.getElement()
          .querySelector(`.film-details__add-emoji-label`);

        clearElement(commentEmojiELement);
        render(commentEmojiELement, new EmojiComponent(emoji));
      }
    };

    subscribeOnEvents(this._filmDetailsComponent);

    this._filmDetailsComponent.setCloseClickHandler(() => {
      this._closeDetailsPopup();
    });


    const updateComments = (id, newData) => {
      const comments = film.comments;

      if (newData === null) {
        this._viewersComments = comments.filter((comment) => comment.id !== id);
      }

      this._onDataChange(this, film, Object.assign({}, film, {
        comments: this._viewersComments,
      }));
    };

    this._filmDetailsComponent.setCommentSubmitHandler((evt) => {
      if (evt.ctrlKey && evt.key === `Enter`) {
        const newComment = {
          id: String(new Date() + Math.random()),
          reaction: this._commentEmoji,
          author: getRandomArrayItem(commentAuthors),
          date: new Date(),
          comment: evt.target.value,
        };

        this._viewersComments.push(newComment);
        updateComments(newComment.id, this._comments);
      }
    });


    this._filmDetailsComponent.setEmojiChangeHandler(onEmojiChange);

    this._filmDetailsComponent.setCommentDeleteClickHandler((evt) => {
      evt.preventDefault();
      const target = evt.target;

      if (target.matches(`.film-details__comment-delete`)) {
        const commentId = target.closest(`.film-details__comment`).dataset.id;
        updateComments(commentId, null);
      }
    });

    const openDetailsPopup = () => {
      this._onViewChange();
      this._filmDetailsComponent.reset();
      append(this._filmDetailsComponent);
      document.addEventListener(`keydown`, this._onEscKeydown);
      subscribeOnEvents(this._filmDetailsComponent);

      this._mode = Mode.EDIT;
    };


    render(this._container, this._filmComponent);

    if (oldFilmDetailsComponent && oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeDetailsPopup();
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _closeDetailsPopup() {
    document.removeEventListener(`keydown`, this._onEscKeydown);

    if (document.contains(this._filmDetailsComponent.getElement())) {
      remove(this._filmDetailsComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeDetailsPopup();
    }
  }
}
