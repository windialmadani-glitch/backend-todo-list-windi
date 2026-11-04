const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ActivityLog = require('../models/ActivityLog');

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find({ user: req.user._id });
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories }
    });
});

exports.createCategory = catchAsync(async (req, res, next) => {
    req.body.user = req.user._id;
    const newCategory = await Category.create(req.body);
    await ActivityLog.create({
  user: req.user._id,
  action: 'CREATE_CATEGORY',
  category: newCategory._id,
  description: `Membuat kategori: ${newCategory.name}`,
  snapshot: { name: newCategory.name }
});
    res.status(201).json({
        status: 'success',
        data: { category: newCategory }
    });
});

exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new AppError('Kategori tidak ditemukan', 404));
    }
    if (category.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Anda tidak memiliki akses ke kategori ini', 403));
    }
    res.status(200).json({ status: 'success', data: { category } });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return next(new AppError('Kategori tidak ditemukan', 404));
    }
    if (category.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Anda tidak memiliki izin untuk mengubah kategori ini', 403));
    }
    category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await ActivityLog.create({
  user: req.user._id,
  action: 'UPDATE_CATEGORY',
  category: category._id,
  description: `Mengubah kategori: ${category.name}`,
  snapshot: { name: category.name }
});
    res.status(200).json({ status: 'success', data: { category } });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new AppError('Kategori tidak ditemukan', 404));
    }
    if (category.user.toString() !== req.user._id.toString()) {
        return next(new AppError('Anda tidak memiliki izin untuk menghapus kategori ini', 403));
    }
    await Category.findByIdAndDelete(req.params.id);
    await ActivityLog.create({
  user: req.user._id,
  action: 'DELETE_CATEGORY',
  category: category._id,
  description: `Menghapus kategori: ${category.name}`,
  snapshot: { name: category.name }
});
    res.status(200).json({ status: 'success', message: 'Kategori berhasil dihapus' });
});