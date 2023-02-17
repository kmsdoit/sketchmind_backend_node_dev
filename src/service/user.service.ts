import {Request,Response,NextFunction} from "express";
import User from "../models/user";
const bcrypt = require('bcrypt');
import Joi from 'joi'

const postUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});



export class UserService {

    async getAllUser() {

    }

    async createUser(req:Request,res: Response,next: NextFunction) {
        try {
            const {email, password, name} = await postUserSchema.validateAsync(req.body)

            const exUser = await User.findOne({
                where : {
                    email
                }
            });

            if (exUser) {
                return res.status(403).send({
                    "status" : 403,
                    "message" : "이미 사용중인 이메일입니다."
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            await User.create({
                email,
                name,
                password : hashedPassword
            })

            res.status(201).send({
                "status" : 200,
                "message" : "회원가입 성공!                                       "
            })
        }catch (error: any) {
            console.log(error)
            res.status(400).send({
                "status" : 400,
                "message" : error['details'][0]['message']
            })
            next(error); // status 500
        }
    }
}