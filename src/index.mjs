import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import router from "./routes/router.mjs";
const prefix = "/api/v1";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// app.use(prefix, router);
// Wrap all routes in try-catch
app.use('/api/v1', async (req, res, next) => {
    try {
        await router(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        message: 'Not Found',
        path: req.path
    });
});

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });

// Remove the app.listen() part for Vercel deployment
// Instead, export the app
export default app;