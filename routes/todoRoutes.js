const express = require('express');
const todoController = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Middleware pengecekan error dari express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'fail', 
      errors: errors.array() 
    });
  }
  next();
};

// Semua endpoint todo wajib login
router.use(protect);

router.route('/')
  .get(todoController.getAllTodos)
  .post(
    body('title').notEmpty().withMessage('Title tidak boleh kosong'),
    validate,
    todoController.createTodo
  );

router.route('/:id')
  .get(todoController.getTodo)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;