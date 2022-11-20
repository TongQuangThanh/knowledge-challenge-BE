"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthenticated = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const const_1 = require("../const");
const user_1 = require("../mongoose/user");
const userAuthenticated = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization || 'Bearer';
        const authorizations = authorizationHeader.split(' ');
        if (authorizations.length === 2) {
            const token = authorizations[1];
            const decoded = jsonwebtoken_1.default.verify(token, `${process.env.TOKEN_SECRET}`);
            user_1.UserSchema.findById(decoded.userId)
                .then(result => {
                if ((result === null || result === void 0 ? void 0 : result.email) === decoded.email) {
                    req.body.userId = decoded.userId;
                    next();
                }
                else {
                    res.status(403).json(const_1.ERROR_FORBIDDEN);
                }
            })
                .catch(err => res.status(403).json(const_1.ERROR_FORBIDDEN));
        }
        else {
            res.status(401).json(const_1.ERROR_AUTHENTICATE_REQUIRED);
            return;
        }
    }
    catch (err) {
        if (!(err instanceof jsonwebtoken_1.JsonWebTokenError)) {
            console.error(err);
        }
        res.status(400).json(const_1.ERROR_CLIENT);
        return;
    }
};
exports.userAuthenticated = userAuthenticated;
