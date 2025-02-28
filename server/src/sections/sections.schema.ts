import mongoose, { Schema } from 'mongoose';

export const SectionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  teachersCount: { type: Number, required: true },
  studentsCount: { type: Number, required: true },
  gradeId: { type: Schema.Types.ObjectId, required: true },
  activeTeachersCount: { type: Number, required: true },
  activeStudentsCount: { type: Number, required: true },
  inActiveTeachersCount: { type: Number, required: true },
  inActiveStudentsCount: { type: Number, required: true },
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
});
