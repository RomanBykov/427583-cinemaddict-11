export default class Comment {
  constructor(commentData) {
    this.id = commentData.id;
    this.reaction = commentData.emotion;
    this.author = commentData.author;
    this.date = commentData.date;
    this.comment = commentData.comment;
  }

  static parseComment(commentData) {
    return new Comment(commentData);
  }

  static parseComments(commentData) {
    return commentData.map(Comment.parseComment);
  }
}
