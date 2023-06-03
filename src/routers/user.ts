import express from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { UserSchema } from '../mongoose/user'
import { ERROR_EMAIL_DUPLICATE, ERROR_EMAIL_NOT_FOUND, ERROR_SERVER, ERROR_SIGNIN_FAIL, ERROR_USER_NOT_FOUND, LIMIT, SUCCESS_FETCH, SUCCESS_RESET_PASSWORD, SUCCESS_SIGNIN, SUCCESS_SIGNUP } from '../const';
import { userAuthenticated } from '../middleware/token';
import { AchievementSchema } from '../mongoose/achievement';
import { QuestionSetSchema } from '../mongoose/question-set';
export const userRouters = express.Router();

const salt = process.env.SALT_ROUNDS || LIMIT;

userRouters.post('/change', (req, res) => {
});

userRouters.post('/forgot-password', (req, res) => {
  UserSchema.findOne({ email: req.body.email }).then(user => {
    if (user && req.body.email) {
      const password = '123456';
      bcrypt.hash(password, salt)
        .then(hash => {
          user.password = hash;
          user.save().then(result => res.status(200).json({ message: SUCCESS_RESET_PASSWORD, data: user }));
        })
        .catch(err => res.status(500).json({ message: ERROR_SERVER, data: null }));
    } else {
      res.status(401).json({ message: ERROR_EMAIL_NOT_FOUND, data: null });
    }
  })
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: null }));
});

userRouters.post('/signin', (req, res) => {
  UserSchema.findOne({ email: req.body.email }).then(user => {
    let token = '';
    if (user && bcrypt.compareSync(req.body.password, user?.password || '')) {
      token = jwt.sign({ email: user.email, userId: user._id }, process.env.TOKEN_SECRET as Secret, { expiresIn: "30d" });
    }
    res.status(token ? 200 : 401).json({ message: token ? SUCCESS_SIGNIN : ERROR_SIGNIN_FAIL, data: token ? { token, user } : null });
  })
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

userRouters.post('/signup', async (req, res) => {
  // if (req.body.password !== req.body.rePassword) {
  // }
  const user = await UserSchema.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: ERROR_EMAIL_DUPLICATE, data: null });
  }
  bcrypt.hash(req.body.password, salt)
    .then(hash => {
      const user = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        avatarUrl: req.body.avatar,
        birth: req.body.birth
      });
      user.save().then(result => {
        const token = jwt.sign({ email: user.email, userId: result._id }, process.env.TOKEN_SECRET as Secret, { expiresIn: "30d" });
        res.status(201).json({ message: SUCCESS_SIGNUP, data: { token, user } });
      });
    })
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

userRouters.get('/profile', userAuthenticated, async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ message: ERROR_USER_NOT_FOUND, data: null });
    }
    const achievementList = await AchievementSchema.find({ scoredBy: userId });
    const questionSets = await QuestionSetSchema.find({ userId });
    const userInfo = {
      userName: user.name,
      scores: achievementList.reduce((total, achievement) => total + (achievement.point || 0), 0),
      // followers: 
      // friends:
      questionSets
    };
    res.status(200).json({ message: SUCCESS_FETCH, data: userInfo });
  } catch (error) {
    res.status(500).json({ message: ERROR_SERVER, data: error });
  }
});
