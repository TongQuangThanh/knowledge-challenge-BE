"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementRouters = void 0;
const express_1 = __importDefault(require("express"));
const achievement_1 = require("../mongoose/achievement");
const const_1 = require("../const");
exports.achievementRouters = express_1.default.Router();
exports.achievementRouters.get('/list', (req, res) => {
    const page = +(req.query.page || 1) - 1;
    const limit = +(req.query.limit || 10);
    let match = {};
    if (req.body.userId) {
        match = { scoredBy: req.body.userId };
    }
    achievement_1.AchievementSchema.aggregate([
        { $match: match },
        { $sort: { point: -1 } },
        facet(limit, page)
    ])
        .then(result => res.status(200).json({ message: const_1.SUCCESS_FETCH, data: result }))
        .catch(err => res.status(500).json({ message: const_1.ERROR_SERVER, data: err }));
});
exports.achievementRouters.post('/save', (req, res) => {
    const achievement = new achievement_1.AchievementSchema(Object.assign({}, req.body));
    achievement.save()
        .then(result => res.status(200).json({ message: const_1.SUCCESS_ADD_ACHIEVEMENT, data: result }))
        .catch(err => res.status(500).json({ message: const_1.ERROR_SERVER, data: err }));
});
const facet = (limit, page) => {
    return {
        $facet: {
            totalRecords: [{ $count: "total" }],
            achievements: [
                { $skip: limit * page },
                { $limit: limit }
            ]
        }
    };
};
