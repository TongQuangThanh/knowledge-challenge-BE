"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouters = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../mongoose/user");
const const_1 = require("../const");
exports.userRouters = express_1.default.Router();
const salt = process.env.SALT_ROUNDS || const_1.LIMIT;
exports.userRouters.post('/change', (req, res) => {
});
exports.userRouters.post('/forgot-password', (req, res) => {
    user_1.UserSchema.findOne({ email: req.body.email }).then(user => {
        if (user && req.body.email) {
            const password = '123456';
            bcrypt_1.default.hash(password, salt)
                .then(hash => {
                user.password = hash;
                user.save().then(result => res.status(200).json({ message: const_1.SUCCESS_RESET_PASSWORD, data: user }));
            })
                .catch(err => res.status(500).json({ message: const_1.ERROR_SERVER, data: null }));
        }
        else {
            res.status(401).json({ message: const_1.ERROR_EMAIL_NOT_FOUND, data: null });
        }
    })
        .catch(err => res.status(500).json({ message: const_1.ERROR_SERVER, data: null }));
});
exports.userRouters.post('/signin', (req, res) => {
    user_1.UserSchema.findOne({ email: req.body.email }).then(user => {
        let token = '';
        if (user && bcrypt_1.default.compareSync(req.body.password, (user === null || user === void 0 ? void 0 : user.password) || '')) {
            token = jsonwebtoken_1.default.sign({ email: user.email, userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
        }
        res.status(token ? 200 : 401).json({ message: token ? const_1.SUCCESS_SIGNIN : const_1.ERROR_SIGNIN_FAIL, data: token ? { token, user } : null });
    })
        .catch(err => res.status(500).json({ message: const_1.ERROR_SERVER, data: err }));
});
exports.userRouters.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.body.password !== req.body.rePassword) {
    // }
    const user = yield user_1.UserSchema.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: const_1.ERROR_EMAIL_DUPLICATE, data: null });
    }
    bcrypt_1.default.hash(req.body.password, salt)
        .then(hash => {
        const user = new user_1.UserSchema({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            avatarUrl: req.body.avatar,
            birth: req.body.birth
        });
        user.save().then(result => {
            const token = jsonwebtoken_1.default.sign({ email: user.email, userId: result._id }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
            res.status(201).json({ message: const_1.SUCCESS_SIGNUP, data: { token, user } });
        });
    })
        .catch(err => res.status(500).json({ message: const_1.ERROR_SERVER, data: err }));
}));
