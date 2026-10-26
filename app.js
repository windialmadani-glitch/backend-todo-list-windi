require('dotenv').config();
const express = require('express');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activitylogRouter = require('./routes/activitylogRoutes');
const statsRouter = require('./routes/statsRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger');
const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => res.send('Server jalan'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/activity-logs', activitylogRouter);
app.use('/api/stats', statsRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;