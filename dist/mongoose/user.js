"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    avatarUrl: String,
    // followers: { type: String, require: true },
    // friends: { type: String, require: true },
    birth: Date
});
userSchema.plugin(mongoose_unique_validator_1.default);
exports.UserSchema = mongoose_1.default.model('User', userSchema);
