import express from 'express';
import { AchievementSchema } from '../mongoose/achievement'
import { ERROR_SERVER, LIMIT, SUCCESS_ADD, SUCCESS_FETCH } from '../const';
import { ObjectId } from 'mongodb';
export const achievementRouters = express.Router();

achievementRouters.get('/list', (req, res) => {
  const page = +(req.query.page || 1) - 1;
  const limit = +(req.query.limit || LIMIT);
  const board = req.query.board;
  const userId = req.body.userId;
  let match = {};
  if (req.body.userId && board !== 'global') {
    match = { scoredBy: new ObjectId(userId) };
  }
  AchievementSchema.aggregate(
    [
      { $match: match },
      { $sort: { point: -1 } },
      facet(limit, page)
    ]
  )
    .then(result => res.status(200).json({ message: SUCCESS_FETCH, data: result[0] }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

achievementRouters.post('/save', (req, res) => {
  const achievement = new AchievementSchema({ ...req.body });
  achievement.save()
    .then(result => res.status(201).json({ message: SUCCESS_ADD, data: true }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

const facet = (limit: number, page: number) => {
  return {
    $facet: {
      totalRecords: [{ $count: "total" }],
      achievements: [
        { $skip: limit * page },
        { $limit: limit }
      ]
    }
  }
}