import {userAvatars, userRatings} from "../const";

export const generateUser = () => {
  return {
    avatar: userAvatars[0],
    rating: userRatings[0]
  };
};
