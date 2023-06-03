import express from 'express';
import { QuestionSetSchema } from '../mongoose/question-set'
import { ERROR_SERVER, LIMIT, SUCCESS_ADD, SUCCESS_FETCH } from '../const';
import { ObjectId } from 'mongodb';
export const questionSetRouters = express.Router();

questionSetRouters.get('/', (req, res) => {
  const page = +(req.query.page || 1) - 1;
  const limit = +(req.query.limit || LIMIT);
  const userId = req.body.userId;
  const match = { userId: new ObjectId(userId) };
  QuestionSetSchema.aggregate(
    [
      { $match: match },
      { $sort: { point: -1 } },
      facet(limit, page)
    ]
  )
    .then(result => res.status(200).json({ message: SUCCESS_FETCH, data: result[0] }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

questionSetRouters.get('/:id', (req, res) => {
  const id = req.params.id;
  const page = +(req.query.page || 1) - 1;
  const limit = +(req.query.limit || LIMIT);
  const userId = req.body.userId;
  const match = { userId: new ObjectId(userId), _id: id };
  QuestionSetSchema.aggregate(
    [
      { $match: match },
      { $sort: { point: -1 } },
      facet(limit, page)
    ]
  )
    .then(result => res.status(200).json({ message: SUCCESS_FETCH, data: result[0] }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

questionSetRouters.post('/', (req, res) => {
  const questionSet = new QuestionSetSchema({ ...req.body });
  console.log(questionSet);
  questionSet.save()
    .then(result => res.status(201).json({ message: SUCCESS_ADD, data: true }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

const facet = (limit: number, page: number) => {
  return {
    $facet: {
      totalRecords: [{ $count: "total" }],
      questionSets: [
        { $skip: limit * page },
        { $limit: limit }
      ]
    }
  }
}