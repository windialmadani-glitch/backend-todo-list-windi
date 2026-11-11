const Todo = require('../models/Todo');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ActivityLog = require('../models/ActivityLog');

// 1. Ambil semua todo milik user yang sedang login
exports.getAllTodos = catchAsync(async (req, res, next) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const filter = { user: req.user._id };
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const sort = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

    const [todos, total] = await Promise.all([
        Todo.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
        Todo.countDocuments(filter)
    ]);

    res.status(200).json({
        status: 'success',
        results: todos.length,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: { todos }
    });
});

// 2. Buat todo baru
exports.createTodo = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id; // Otomatis set user pemilik todo dari token login
    req.body.created_by = req.user._id;
    req.body.updated_by = req.user._id;
    const newTodo = await Todo.create(req.body);
   await ActivityLog.create({
  user: req.user._id,
  action: 'CREATE_TODO',
  todo: newTodo._id,
  description: `Membuat todo: ${newTodo.title}`,
  snapshot: { title: newTodo.title, description: newTodo.description, status: newTodo.status, category: newTodo.category }
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
    req.body.updated_by = req.user._id;
    delete req.body.created_by;
    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
await ActivityLog.create({
  user: req.user._id,
  action: 'UPDATE_TODO',
  todo: todo._id,
  description: `Mengubah todo: ${todo.title}`,
  snapshot: { title: todo.title, description: todo.description, status: todo.status, category: todo.category }
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
  todo: todo._id,
  description: `Menghapus todo: ${todo.title}`,
  snapshot: { title: todo.title, description: todo.description, status: todo.status, category: todo.category }
});
    res.status(200).json({
        status: 'success',
        message: 'Todo berhasil dihapus'
    });
});