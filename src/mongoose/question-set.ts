import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const questionSetSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  setId: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  numberOfQuestion: { type: Number, require: true },
  duration: { type: Number, require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  questions: { type: Array<mongoose.Schema.Types.ObjectId>, ref: 'Question', require: true }
});

questionSetSchema.plugin(uniqueValidator);

export const QuestionSetSchema = mongoose.model('Question-Set', questionSetSchema);