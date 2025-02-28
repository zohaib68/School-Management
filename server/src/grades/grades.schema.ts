import * as mongoose from 'mongoose';

export const GradesSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true },
    name: { type: String, required: true },
    teachersCount: { type: Number, required: true },
    studentsCount: { type: Number, required: true },
    activeTeachersCount: { type: Number, required: true },
    activeStudentsCount: { type: Number, required: true },
    inActiveTeachersCount: { type: Number, required: true },
    inActiveStudentsCount: { type: Number, required: true },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);
