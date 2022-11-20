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
const browser_1 = __importDefault(require("@emailjs/browser"));
exports.userRouters = express_1.default.Router();
exports.userRouters.get("/data", (_req, res) => {
    res.status(200).json({ message: "Fetch successfully", data: [] });
});
exports.userRouters.post('/change', (req, res) => {
    // UserSchema.findOne({ email: req.body.email }).then(user => {
    //   if (user && req.body.email) {
    //     const password = '123456';
    //     const params = {
    //       to: req.body.email,
    //       password
    //     };
    //     emailjs.send('service_v17mx66', 'template_is53cop', params, 'user_RHbhBWi0166Xhqv2Nx7mm')
    //       .then((result: EmailJSResponseStatus) => {
    //         console.log(result.text);
    //         bcrypt.hash(password, 10)
    //           .then(hash => {
    //             user.password = hash;
    //             user.save().then(result => {
    //               res.status(200).json({ message: "Đổi mật khẩu thành công", data: [] });
    //             });
    //           })
    //           .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Save user' }));
    //       })
    //       .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Send email' }));
    //   } else {
    //     res.status(401).json({ message: "Email không đúng", data: 'Not found user' });
    //   }
    // })
    //   .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Find user error' }));
});
exports.userRouters.post('/forgot-password', (req, res) => {
    user_1.UserSchema.findOne({ email: req.body.email }).then(user => {
        if (user && req.body.email) {
            const password = '123456';
            const params = {
                to: req.body.email,
                password
            };
            browser_1.default.send('service_v17mx66', 'template_is53cop', params, 'user_RHbhBWi0166Xhqv2Nx7mm')
                .then((result) => {
                bcrypt_1.default.hash(password, 10)
                    .then(hash => {
                    user.password = hash;
                    user.save().then(result => {
                        res.status(200).json({ message: "Đổi mật khẩu thành công", data: [] });
                    });
                })
                    .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Save user' }));
            })
                .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Send email' }));
        }
        else {
            res.status(401).json({ message: "Email không đúng", data: 'Not found user' });
        }
    })
        .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Find user error' }));
});
exports.userRouters.post('/signin', (req, res) => {
    user_1.UserSchema.findOne({ email: req.body.email }).then(user => {
        let token = '';
        if (user && bcrypt_1.default.compareSync(req.body.password, (user === null || user === void 0 ? void 0 : user.password) || '')) {
            token = jsonwebtoken_1.default.sign({ email: user.email, userId: user._id }, const_1.APP_NAME_TOKEN, { expiresIn: "30d" });
        }
        res.status(token ? 200 : 401).json({ message: token ? "Đăng nhập thành công" : "Email hoặc mật khẩu không đúng", data: token ? { token, user } : null });
    })
        .catch(err => res.status(500).json({ message: "Lỗi server", data: err }));
});
exports.userRouters.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.body.password !== req.body.rePassword) {
    //   return res.status(400).json({ message: "Nhập lại mật khẩu không khớp", data: null });
    // }
    const user = yield user_1.UserSchema.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "Email đã tồn tại", data: null });
    }
    bcrypt_1.default.hash(req.body.password, 10)
        .then(hash => {
        const user = new user_1.UserSchema({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            avatarUrl: req.body.avatar,
            birth: req.body.birth
        });
        user.save().then(result => {
            const token = jsonwebtoken_1.default.sign({ email: user.email, userId: result._id }, const_1.APP_NAME_TOKEN, { expiresIn: "30d" });
            res.status(201).json({ message: "Đăng ký thành công", data: { token, user } });
        });
    })
        .catch(err => res.status(500).json({ message: "Lỗi server", data: err }));
}));
