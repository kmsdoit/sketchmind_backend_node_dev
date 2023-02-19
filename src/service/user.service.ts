import {Request,Response,NextFunction} from "express";
import User from "../models/user";
const bcrypt = require('bcrypt');
import Joi from 'joi'
import passport from 'passport';


const postUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
export class UserService {

    async getAllUser(req:Request, res:Response, next: NextFunction) {
        try{
            const user = await User.findAll({
                attributes : {
                    exclude : ['password']
                }
            })

            if(user.length === 0) {
                res.status(400).send({
                    "status" : 400,
                    "message" : "유저 전체를 조회 할 수 없습니다"
                })
                return
            }
            return res.status(200).send({
                "status" : 200,
                "message" : "success",
                "data" : user
            })
        }catch (error) {
            return res.status(500).send({
                "status" : 500,
                "message" : error
            })
            next(error)
        }
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

    async login(req:Request, res:Response, next: NextFunction) {
        passport.authenticate('local',(authError:any, user:any, info:any) => {
            console.log(req)
            if(authError) {
                console.error(authError)
                return next(authError)
            }
            if(!user) {
                return res.status(400).send({
                    "status" : 400,
                    "message" : "userNotDefined"
                })
            }
            return req.login(user, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                console.log(user)
                return res.redirect('/api/v1/users');
            })
        })(req, res, next);
    }
}