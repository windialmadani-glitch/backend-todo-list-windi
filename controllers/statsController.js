const Todo = require('../models/Todo');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getSystemStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalTodos = await Todo.countDocuments();
  const completedTodos = await Todo.countDocuments({ status: 'completed' });
  const pendingTodos = await Todo.countDocuments({ status: 'pending' });
  const totalLogs = await ActivityLog.countDocuments();

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalTodos,
        completedTodos,
        pendingTodos,
        totalLogs
      }
    }
  });
});