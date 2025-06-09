// models/User.ts
import { Schema, models, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  API_KEY: {type: String}
});

export const User = models.User || model('User', userSchema);
