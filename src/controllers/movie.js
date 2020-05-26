import EmojiComponent from "../components/emoji";
import MovieComponent from "../components/movie";
import MovieDetailsComponent from "../components/movie-details";
import MovieModel from "../models/movie";
import {reactions} from "../const";
import {remove, append, render, clearElement, replace} from "../utils/render";

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._movieComponent = null;
    this._movieDetailsComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._api = api;

    this._viewersComments = [];
    this._commentEmoji = reactions[0];

    this._movie = null;
    this._movieID = null;

    this._openDetailsPopup = this._openDetailsPopup.bind(this);

    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._closeDetailsPopup = this._closeDetailsPopup.bind(this);
  }

  render(movie) {
    this._movie = movie;
    this._movieID = movie.id;
    const oldMovieComponent = this._movieComponent;

    this._movieComponent = new MovieComponent(movie);

    this._movieComponent.setAddToWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(this._movie);
      newMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setAddToWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(this._movie);
      newMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
      newMovie.userDetails.watchingDate = new Date();
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setAddToFavoriteClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(this._movie);
      newMovie.userDetails.favorite = !this._movie.userDetails.favorite;
      this._onDataChange(this, this._movie, newMovie);
    });

    this._movieComponent.setOpenDetailsClickHandler((evt) => {
      if (evt.target.tagName === `BUTTON`) {
        return;
      }

      this._openDetailsPopup();
    });

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
    } else {
      render(this._container, this._movieComponent);
    }
  }

  setDefaultView() {
    if (this._movieDetailsComponent) {
      this._closeDetailsPopup();
    }
  }

  destroy() {
    remove(this._movieComponent);

    if (this._movieDetailsComponent) {
      remove(this._movieDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }

  _openDetailsPopup() {
    this._api.getComments(this._movieID)
      .then((loadedComments) => {
        this._viewersComments = loadedComments;

        this._movieDetailsComponent = new MovieDetailsComponent(this._movie, this._viewersComments);
        this._onViewChange();

        this._movieDetailsComponent.setAddToWatchlistClickHandler(() => {
          const newMovie = MovieModel.clone(this._movie);
          newMovie.userDetails.watchlist = !this._movie.userDetails.watchlist;
          this._onDataChange(this, this._movie, newMovie);
        });

        this._movieDetailsComponent.setAddToWatchedClickHandler(() => {
          const newMovie = MovieModel.clone(this._movie);
          newMovie.userDetails.alreadyWatched = !this._movie.userDetails.alreadyWatched;
          newMovie.userDetails.watchingDate = new Date();
          this._onDataChange(this, this._movie, newMovie);
        });

        this._movieDetailsComponent.setAddToFavoriteClickHandler(() => {
          const newMovie = MovieModel.clone(this._movie);
          newMovie.userDetails.favorite = !this._movie.userDetails.favorite;
          this._onDataChange(this, this._movie, newMovie);
        });

        this._movieDetailsComponent.setCloseClickHandler(() => {
          this._closeDetailsPopup();
        });

        this._movieDetailsComponent.setEmojiChangeHandler((evt) => {
          if (evt.target.matches(`.film-details__emoji-item`)) {
            const emoji = evt.target.value;
            this._commentEmoji = emoji;

            const commentEmojiELement = this._movieDetailsComponent.getElement()
              .querySelector(`.film-details__add-emoji-label`);

            clearElement(commentEmojiELement);
            render(commentEmojiELement, new EmojiComponent(emoji));
          }
        });

        this._movieDetailsComponent.setCommentDeleteClickHandler((evt) => {
          evt.preventDefault();
          const target = evt.target;

          if (target.matches(`.film-details__comment-delete`)) {
            const commentID = target.closest(`.film-details__comment`).dataset.id;
            target.textContent = `Deleting…`;
            target.disabled = true;

            this._api.deleteComment(commentID)
              .then(() => {
                const newMovie = MovieModel.clone(this._movie);
                newMovie.comments = this._getCommentsIDs();
                this._viewersComments = this._deleteCommentFromViewersComments(commentID);
                this._updateMovie(newMovie);
              })
              .catch(() => {
                target.textContent = `Delete`;
                target.disabled = false;
                // debugger;
                this._movieDetailsComponent.shake(commentID);
              });
          }
        });

        this._movieDetailsComponent.setCommentSubmitHandler((evt) => {
          if (evt.ctrlKey && evt.key === `Enter`) {
            this._movieDetailsComponent.disableForm(true);
            evt.target.classList.remove(`error-input`);

            const newComment = {
              emotion: this._commentEmoji,
              date: new Date().toISOString(),
              comment: evt.target.value,
            };

            this._api.addComment(this._movieID, newComment)
              .then((newCommentData) => {
                const newMovie = MovieModel.clone(this._movie);
                newMovie.comments = newCommentData.movie.comments;
                this._viewersComments = newCommentData.comments;
                this._updateMovie(newMovie);
              })
              .catch(() => {
                evt.target.classList.add(`error-input`);
                this._movieDetailsComponent.disableForm(false);
                this._movieDetailsComponent.shake();
              });
          }
        });

        append(this._movieDetailsComponent);
        document.addEventListener(`keydown`, this._onEscKeydown);
        document.querySelector(`body`)
          .classList.add(`hide-overflow`);
      });
  }

  _closeDetailsPopup() {
    remove(this._movieDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
    document.querySelector(`body`)
      .classList.remove(`hide-overflow`);
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeDetailsPopup();
    }
  }

  _deleteCommentFromViewersComments(id) {
    return this._viewersComments.filter((comment) => comment.id !== id);
  }

  _getCommentsIDs() {
    return this._viewersComments.map((comment) => comment.id);
  }

  _updateMovie(newData) {
    this._onDataChange(this, this._movie, newData);
    this._movieDetailsComponent.updateComments(this._viewersComments);
    this._movieDetailsComponent.rerender();
  }
}
