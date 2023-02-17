import express from 'express'
import dotenv from 'dotenv'
import {sequelize} from "./models";
dotenv.config()
const app = express()
const PORT = process.env.PORT
const userRouter = require('./routes/user-route')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouter);

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.listen(PORT, () => {
    console.log(`----------------- your server listening on port : ${PORT} --------------------`);
});