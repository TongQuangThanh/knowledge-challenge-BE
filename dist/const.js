"use strict";
// export const APP_NAME = 'thnvn_knowledge-challenge_';
// export const APP_NAME_TOKEN = APP_NAME + 'token';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_ADD = exports.SUCCESS_FETCH = exports.SUCCESS_SIGNUP = exports.SUCCESS_SIGNIN = exports.SUCCESS_RESET_PASSWORD = exports.ERROR_AUTHENTICATE_REQUIRED = exports.ERROR_FORBIDDEN = exports.ERROR_CLIENT = exports.ERROR_EMAIL_DUPLICATE = exports.ERROR_EMAIL_NOT_FOUND = exports.ERROR_SIGNIN_FAIL = exports.ERROR_SERVER = exports.LIMIT = exports.Category = exports.QuestionType = void 0;
var QuestionType;
(function (QuestionType) {
    QuestionType["text"] = "text_choice";
    QuestionType["image"] = "image_choice";
})(QuestionType = exports.QuestionType || (exports.QuestionType = {}));
var Category;
(function (Category) {
    Category["music"] = "music";
    Category["sport"] = "sport_and_leisure";
    Category["film"] = "film_and_tv";
    Category["art"] = "arts_and_literature";
    Category["history"] = "history";
    Category["culture"] = "society_and_culture";
    Category["science"] = "science";
    Category["geography"] = "geography";
    Category["food"] = "food_and_drink";
    Category["general"] = "general_knowledge";
})(Category = exports.Category || (exports.Category = {}));
exports.LIMIT = 10;
// ERROR
exports.ERROR_SERVER = 'Server error!!!';
exports.ERROR_SIGNIN_FAIL = 'Email or password not match';
exports.ERROR_EMAIL_NOT_FOUND = 'Email not found!!!';
exports.ERROR_EMAIL_DUPLICATE = 'Email are duplicate. Please choose another email address';
exports.ERROR_CLIENT = 'Error occur. Please try again later!';
exports.ERROR_FORBIDDEN = 'You are not allow!';
exports.ERROR_AUTHENTICATE_REQUIRED = 'User not authenticated!';
// SUCCESS
exports.SUCCESS_RESET_PASSWORD = 'Reset password successfully';
exports.SUCCESS_SIGNIN = 'Login successfully';
exports.SUCCESS_SIGNUP = 'Signup successfully';
exports.SUCCESS_FETCH = 'Fetch successfully';
exports.SUCCESS_ADD = 'Add successfully';
