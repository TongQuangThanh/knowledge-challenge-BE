import express from 'express';
import { AchievementSchema } from '../mongoose/achievement'
import { ERROR_SERVER, SUCCESS_ADD_ACHIEVEMENT, SUCCESS_FETCH } from '../const';
export const achievementRouters = express.Router();

achievementRouters.get('/user', (req, res) => {
  AchievementSchema.find({ scoredBy: req.body.userId })
    .then(result => {
      res.status(200).json({ message: SUCCESS_FETCH, data: result })
    })
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

achievementRouters.get('/global', (req, res) => {
  AchievementSchema.find()
    .then(result => {
      res.status(200).json({ message: SUCCESS_FETCH, data: result })
    })
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
