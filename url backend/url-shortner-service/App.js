import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { redirectUrl } from './controllers/Url.controller.js';

const app = express();

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true, limit:'16kb'}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(cookieParser());
import UserRouter from './routes/User.route.js';
import { Url} from './routes/Url.route.js';
app.use("/api/user",UserRouter);
app.use("/api/shorten",Url);
app.use("/api/analytics",Url);
app.get("/:shortUrl", redirectUrl);
export default app;