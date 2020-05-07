export default class Comments {
  constructor() {
    this._comments = [];

    this._dataChangeHandlers = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = Array.from(comments);
    // this._callhandlers(this._dataChangeHandlers);
  }

  updateComments(id, comment) {
    const index = this._comments.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), comment, this._comments.slice(index + 1));

    this._callhandlers(this._dataChangeHandlers);

    return true;
  }
}
