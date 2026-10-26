const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

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
    res.status(200).json({ status: 'success', message: 'Kategori berhasil dihapus' });
});