import AbstractComponent from "./abstract-component";

const createEmojiTemplate = (emoji) => {
  return (
    `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`
  );
};

export default class Emoji extends AbstractComponent {
  constructor(emoji) {
    super();

    this._emoji = emoji;
  }

  getTemplate() {
    return createEmojiTemplate(this._emoji);
  }
}
