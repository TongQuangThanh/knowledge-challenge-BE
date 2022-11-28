"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const achievementSchema = new mongoose_1.default.Schema({
    point: { type: Number, require: true },
    difficult: { type: String, require: true },
    count: { type: Number, require: true },
    countTrue: { type: Number, require: true },
    countFail: { type: Number, require: true },
    elapsedTime: { type: String, require: true },
    elapsedTimeNumber: { type: Number, require: true },
    dateScore: { type: Date, require: true },
    scoredBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', require: true },
    userName: String,
    questionIds: { type: Array, require: true, "default": [] }
});
achievementSchema.plugin(mongoose_unique_validator_1.default);
exports.AchievementSchema = mongoose_1.default.model('Achievement', achievementSchema);
