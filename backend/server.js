require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/db', require('./routes/dbRoutes'));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DevQ&A API',
            version: '1.0.0',
            description: 'REST API for DevQ&A platform - questions, answers, comments, authentication',
            contact: {
                name: 'DevQ&A Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/swagger.json', (req, res) => res.json(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));