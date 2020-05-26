import AbstractComponent from "./abstract-component";

const createUserProfileTemplate = (user) => {
  const {avatar, rating} = user;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/${avatar}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile extends AbstractComponent {
  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createUserProfileTemplate(this._user);
  }
}
