require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const activitylogRouter = require('./routes/activitylogRoutes');
const statsRouter = require('./routes/statsRoutes');
const externalRouter = require('./routes/externalRoutes');
const swaggerDocument = require('./docs/swagger');
const app = express();

app.use(express.json());
app.use(logger);
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ message: 'Database tidak tersedia' });
  }
});

app.get('/', (req, res) => res.send('Server jalan'));

const SWAGGER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0';

app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocument));

app.get(['/api-docs', '/api-docs/'], (req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Todo List API</title>
  <link rel="stylesheet" href="${SWAGGER_CDN}/swagger-ui.min.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_CDN}/swagger-ui-bundle.js"></script>
  <script src="${SWAGGER_CDN}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: '/api-docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`);
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/activity-logs', activitylogRouter);
app.use('/api/stats', statsRouter);
app.use('/api/external', externalRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;