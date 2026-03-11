import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { redirectUrl } from './controllers/Url.controller.js';

const app = express();

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true, limit:'16kb'}));
app.use(express.static('public'));
app.use(cors({
    origin:'CORS_ORIGIN',
    credentials:true,
}));
app.use(cookieParser());
import UserRouter from './routes/User.route.js';
import { UrlShortner } from './routes/Url.route.js';
app.use("/api/user",UserRouter);
app.use("/api/shorten",UrlShortner);
app.get("/:shortUrl", redirectUrl);
export default app;