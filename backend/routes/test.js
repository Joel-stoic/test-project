import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import auth from '../middleware/auth.js';
import Test from '../models/Test.js';
import Question from '../models/Question.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Create Test
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const test = new Test({ title, description });
    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List Tests with Questions
router.get('/', auth, async (req, res) => {
  try {
    const tests = await Test.find().populate('questions');
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Question to Test
router.post('/:testId/questions', auth, async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    const question = new Question({ questionText, options, correctAnswer, test: test._id });
    await question.save();
    test.questions.push(question._id);
    await test.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk Upload Questions via CSV
router.post('/:testId/questions/upload', auth, upload.single('file'), async (req, res) => {
  const testId = req.params.testId;
  const filePath = req.file.path;
  const questions = [];

  fs.createReadStream(filePath)
    .pipe(csv(['questionText', 'option1', 'option2', 'option3', 'option4', 'correctAnswer']))
    .on('data', (row) => {
      questions.push(row);
    })
    .on('end', async () => {
      try {
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });
        const createdQuestions = [];
        for (const q of questions) {
          const question = new Question({
            questionText: q.questionText,
            options: [q.option1, q.option2, q.option3, q.option4],
            correctAnswer: q.correctAnswer,
            test: test._id,
          });
          await question.save();
          test.questions.push(question._id);
          createdQuestions.push(question);
        }
        await test.save();
        fs.unlinkSync(filePath); // Clean up uploaded file
        res.status(201).json({ message: 'Questions uploaded', questions: createdQuestions });
      } catch (err) {
        fs.unlinkSync(filePath);
        res.status(500).json({ message: 'Server error' });
      }
    });
});

export default router; 