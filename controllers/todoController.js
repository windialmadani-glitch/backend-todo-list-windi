const Todo = require('../models/Todo');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ActivityLog = require('../models/ActivityLog');

// 1. Ambil semua todo milik user yang sedang login
exports.getAllTodos = catchAsync(async (req, res, next) => {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json({
        status: 'success',
        results: todos.length,
        data: { todos }
    });
});

// 2. Buat todo baru
exports.createTodo = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id; // Otomatis set user pemilik todo dari token login
    const newTodo = await Todo.create(req.body);
    await ActivityLog.create({
    user: req.user._id,
    action: 'CREATE_TODO',
    description: `Membuat todo: ${newTodo.title}`
  });
    res.status(201).json({
        status: 'success',
        data: { todo: newTodo }
    });
});

// 3. Ambil detail satu todo (dengan cek kepemilikan)
exports.getTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new AppError('Todo tidak ditemukan', 404));
    }
    // Cek kepemilikan
    if (todo.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Anda tidak memiliki akses ke todo ini', 403));
    }
    res.status(200).json({
        status: 'success',
        data: { todo }
    });
});

// 4. Update todo (dengan cek kepemilikan)
exports.updateTodo = catchAsync(async (req, res, next) => {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new AppError('Todo tidak ditemukan', 404));
    }
    // Cek kepemilikan
    if (todo.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Anda tidak memiliki izin untuk mengubah todo ini', 403));
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
await ActivityLog.create({
    user: req.user._id,
    action: 'UPDATE_TODO',
    description: `Mengubah todo: ${todo.title}`
  });
    res.status(200).json({
        status: 'success',
        data: { todo }
    });
});

// 5. Hapus todo (dengan cek kepemilikan)
exports.deleteTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new AppError('Todo tidak ditemukan', 404));
    }
    // Cek kepemilikan
    if (todo.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Anda tidak memiliki izin untuk menghapus todo ini', 403));
    }

    await Todo.findByIdAndDelete(req.params.id);
await ActivityLog.create({
    user: req.user._id,
    action: 'DELETE_TODO',
    description: `Menghapus todo: ${todo.title}`
  });
    res.status(200).json({
        status: 'success',
        message: 'Todo berhasil dihapus'
    });
});