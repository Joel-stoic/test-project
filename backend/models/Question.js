import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], // [option1, option2, option3, option4]
  correctAnswer: { type: String, required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
});

export default mongoose.model('Question', QuestionSchema); 