import express from 'express';
import { QuestionSetSchema } from '../mongoose/question-set'
import { ERROR_SERVER, LIMIT, SUCCESS_ADD, SUCCESS_DELETE, SUCCESS_FETCH } from '../const';
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
  QuestionSetSchema.findById(id)
    .then(data => res.status(200).json({ message: SUCCESS_FETCH, data }))
    .catch(err => res.status(500).json({ message: ERROR_SERVER, data: err }));
});

questionSetRouters.delete('/:id', (req, res) => {
  const id = req.params.id;
  QuestionSetSchema.deleteOne({ _id: id })
    .then(result => res.status(200).json({ message: SUCCESS_DELETE, data: result }))
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
