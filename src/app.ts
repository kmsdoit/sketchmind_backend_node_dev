import express from 'express'
import dotenv from 'dotenv'
import {sequelize} from "./models";
dotenv.config()
const app = express()
const PORT = process.env.PORT
const userRouter = require('./routes/user-route')
const passport = require('passport');
import passportConfig from './passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';


sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
passportConfig()
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
//
app.use(passport.initialize());
app.use(passport.session());
app.use(userRouter);



app.listen(PORT, () => {
    console.log(`----------------- your server listening on port : ${PORT} --------------------`);
});