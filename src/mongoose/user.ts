import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  avatarUrl: String,
  // followers: { type: String, require: true },
  // friends: { type: String, require: true },
  birth: Date
});

userSchema.plugin(uniqueValidator);

export const UserSchema = mongoose.model('User', userSchema);
