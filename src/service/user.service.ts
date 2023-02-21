import {Request,Response,NextFunction} from "express";
import User from "../models/user";
const bcrypt = require('bcrypt');
import Joi from 'joi'
import passport from 'passport';
const redisClient = require('../utils/redis')
const jwt = require('jsonwebtoken')


const postUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone : Joi.string().required(),
    role: Joi.string().required(),
    sns_type : Joi.string().required(),
});

const updateUserSchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().required(),
    password : Joi.string().required(),
    phone : Joi.string().required()
})

export class UserService{



    async getAllUser(req:Request, res:Response, next: NextFunction) {
        try{
            const user = await User.findAll({
                attributes : {
                    exclude : ['password','refreshToken']
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
            const {email, password, name, phone,role, sns_type} = await postUserSchema.validateAsync(req.body)

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
                phone,
                role,
                sns_type,
                password : hashedPassword,
                refreshToken : ''
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
            if(authError) {
                console.error(authError)
                return next(authError)
            }
            if(!user) {
                return res.status(400).send({
                    "status" : 400,
                    ...info
                })
            }
            return req.login(user, async (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                const accessToken = jwt.sign({
                    id : user.id,
                    email: user.email,
                    role : user.role
                }, process.env.JWT_SECRET,{
                    expiresIn: "20m",
                    issuer : "sketchmind",
                    subject : "userInfo"
                });

                const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                    issuer : "sketchmind",
                    subject : "userInfo"
                });

                await User.update({refreshToken},{where : { id : user.id}})

                return res.status(200).send({
                    "status" : 200,
                    token : {
                        accessToken,
                        refreshToken
                    }
                })
            })
        })(req, res, next);
    }

    async getUserById(req:Request, res:Response, next: NextFunction) {
        if(req.headers.authorization !== undefined) {
            const token = req.headers.authorization.split('Bearer ')[1];
            const tokenDecoder = jwt.decode(token)

            const user = await User.findOne({
                where : {
                    id : tokenDecoder.id
                },
                attributes : {
                    exclude: ['password', 'refreshToken']
                }
            })

            if(!user) {
                return res.status(400).send({
                    "status" : 400,
                    "message" : "회원 정보를 찾을 수 없습니다"
                })
            }

            return res.status(200).send({
                "status" : 200,
                "message" : "조회 결과",
                "data" : user.dataValues
            })
        }
    }

    async updateUserById(req:Request, res:Response, next: NextFunction){
        if(req.headers.authorization !== undefined) {
            const {email, password, name, phone} = await updateUserSchema.validateAsync(req.body)
            const token = req.headers.authorization.split('Bearer ')[1];
            const tokenDecoder = jwt.decode(token)

            const user = await User.findOne({
                where : {
                    id : tokenDecoder.id
                },
                attributes : {
                    exclude: ['refreshToken','role','sns_type','createdAt','updatedAt','deletedAt']
                }
            })

            if(!user) {
                return res.status(400).send({
                    "status" : 400,
                    "message" : "회원 정보를 찾을 수 없습니다"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12);


            try {
                await User.update({
                    email,
                    password : hashedPassword,
                    name,
                    phone
                },{
                    where : {
                        id : user.dataValues.id
                    }
                })

                return res.status(200).send({
                    "status" : 200,
                    "message" : "계정 정보가 변경 되었습니다"
                })
            }catch (error : any) {
                return res.status(400).send({
                    "status" : 400,
                    "message" : error
                })
            }
        }
    }
}