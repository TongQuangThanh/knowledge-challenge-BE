import express from 'express';
import { AchievementSchema } from '../mongoose/achievement'
import { ERROR_SERVER, SUCCESS_ADD_ACHIEVEMENT, SUCCESS_FETCH } from '../const';
export const achievementRouters = express.Router();

achievementRouters.get('/achievement', (req, res) => {
  const page = +(req.query.page || 1) - 1;
  const limit = +(req.query.limit || 10);
  let match = {};
  if (req.body.userId) {
    match = { scoredBy: req.body.userId };
  }
  AchievementSchema.aggregate(
    [
      { $match: match },
      { $sort: { createdAt: -1 } },
      facet(limit, page)
    ]
  )
    .then(result => res.status(200).json({ message: SUCCESS_FETCH, data: result }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

achievementRouters.post('/save', (req, res) => {
  const achievement = new AchievementSchema({ ...req.body });
  achievement.save()
    .then(result => {
      res.status(200).json({ message: SUCCESS_ADD_ACHIEVEMENT, data: result })
    })
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

const facet = (limit: number, page: number) => {
  return {
    $facet: {
      totalRecords: [{ $count: "total" }],
      movies: [
        { $skip: limit * page },
        { $limit: limit }
      ]
    }
  }
}