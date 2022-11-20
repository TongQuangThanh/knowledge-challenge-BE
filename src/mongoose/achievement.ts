import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const achievementSchema = new mongoose.Schema({
  point: { type: Number, require: true },
  difficult: { type: String, require: true },
  count: { type: Number, require: true },
  countTrue: { type: Number, require: true },
  countFail: { type: Number, require: true },
  elapsedTime: { type: String, require: true },
  elapsedTimeNumber: { type: Number, require: true },
  dateScore: { type: Date, require: true },
  scoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  questionIds: { type: Array, require: true, "default": [] }
});

achievementSchema.plugin(uniqueValidator);

export const AchievementSchema = mongoose.model('Achievement', achievementSchema);