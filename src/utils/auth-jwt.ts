import {Request, Response, NextFunction} from 'express'
const {verify} = require('../utils/jwt-util')
import User from '../models/user'

interface IUserRequest extends Request {
    user: User
}
const authJWT = (req:IUserRequest, res:Response, next:NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log(token)
        const result = verify(token);
        if (result.ok) {
            req.user.id = result.id;
            req.user.role = result.role;
            next();
        } else {
            res.status(401).send({
                ok: false,
                message: result.message,
            });
        }
    }
};

module.exports = authJWT;