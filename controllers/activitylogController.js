const ActivityLog = require('../models/ActivityLog');
const catchAsync = require('../utils/catchAsync');

exports.getMyActivityLogs = catchAsync(async (req, res, next) => {
  const logs = await ActivityLog.find({ user: req.user._id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: { logs }
  });
});