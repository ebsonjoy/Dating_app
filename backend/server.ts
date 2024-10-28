
import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
// import { container } from './config/container';
import {notFound,errorHandler} from './middleware/errorMiddleware'
import userRoutes from './routes/userRoutes'
import adminRoutes from './routes/adminRoutes'

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

connectDB();
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('Server is ready');
});
app.use(express.json());
app.use(express.static('backend/public'));
app.use(express.urlencoded({extended : true}));
app.use('/api/users', userRoutes);
app.use('/api/admin',adminRoutes)


app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));