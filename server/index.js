import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDb from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoute from './routes/authRoute.js'
import sessionRoute from './routes/sessionRoute.js'
import path from 'path';



dotenv.config();


const app = express();
const PORT = process.env.PORT || 8000;


const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials: true
}

connectDb();

app.use(cors(corsOption));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Live class server is running',
        timestamp: new Date().toISOString()
    })
})

//Api routes
app.use('/api/auth', authRoute)
app.use('/api/session', sessionRoute)

app.use(errorHandler)

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "../client/build");

    app.use(express.static(clientBuildPath));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(clientBuildPath, "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});