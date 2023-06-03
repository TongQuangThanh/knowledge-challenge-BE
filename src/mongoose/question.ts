import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Category, QuestionType } from '../const';

const questionSchema = new mongoose.Schema({
  category: { type: Category },
  correctAnswer: { type: String, require: true },
  difficulty: { type: String, require: true },
  incorrectAnswers: { type: Array, require: true, "default": [] },
  isNiche: { type: Boolean },
  question: { type: String, require: true, unique: true },
  regions: { type: Array, "default": [] },
  tags: { type: Array, "default": [] },
  type: { type: QuestionType, require: true, "default": "text_choice" },
  isUserDefine: { type: Boolean, require: true, "default": true },
  questionSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question-Set', require: true },
});

questionSchema.plugin(uniqueValidator);

export const QuestionSchema = mongoose.model('Question', questionSchema);
