import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, default: null },
    dateOfBirth: { type: String, required: false },
    role: { type: String, required: true },
    dateOfEnrollMent: { type: String, required: true },
    grade: { type: String, required: false },
    dateOfLeave: { type: String, required: false },
    status: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: false },
    userName: { type: String, required: false },
    sectionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        reference: 'sections',
      },
    ],
    gradeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        reference: 'grades',
      },
    ],
    inActivatedAt: { type: String, required: false },
  },
  { timestamps: true },
);
