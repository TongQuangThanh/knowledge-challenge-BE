// export const APP_NAME = 'thnvn_knowledge-challenge_';
// export const APP_NAME_TOKEN = APP_NAME + 'token';

export type Guid = string & { isGuid: true };

export enum QuestionType {
  text = 'text_choice',
  image = 'image_choice'
}

export enum Category {
  music = 'music',
  sport = 'sport_and_leisure',
  film = 'film_and_tv',
  art = 'arts_and_literature',
  history = 'history',
  culture = 'society_and_culture',
  science = 'science',
  geography = 'geography',
  food = 'food_and_drink',
  general = 'general_knowledge'
}

export const LIMIT = 10;

// ERROR
export const ERROR_SERVER = 'Server error!!!';
export const ERROR_SIGNIN_FAIL = 'Email or password not match';
export const ERROR_EMAIL_NOT_FOUND = 'Email not found!!!';
export const ERROR_EMAIL_DUPLICATE = 'Email are duplicate. Please choose another email address';
export const ERROR_CLIENT = 'Error occur. Please try again later!';
export const ERROR_FORBIDDEN = 'You are not allow!';
export const ERROR_AUTHENTICATE_REQUIRED = 'User not authenticated!';
export const ERROR_USER_NOT_FOUND = 'User not found!!!';

// SUCCESS
export const SUCCESS_RESET_PASSWORD = 'Reset password successfully';
export const SUCCESS_SIGNIN = 'Login successfully';
export const SUCCESS_SIGNUP = 'Signup successfully';
export const SUCCESS_FETCH = 'Fetch successfully';
export const SUCCESS_ADD = 'Add successfully';
export const SUCCESS_DELETE = 'Delete successfully';
