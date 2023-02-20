import {Request, Response, NextFunction} from 'express';
const redis = require('redis');

const redisClient = redis.createClient(6379);

redisClient
    .connect()
    .then(async (res:any) => {
        console.log('connected');
    })
    .catch((err : any) => {
        console.log('err happened' + err);
    });

const set = (key : string, value:string) => {
    redisClient.set(key, JSON.stringify(value));
};

const get = (req:Request, res:Response, next:NextFunction) => {
    let key = req.originalUrl;

    redisClient.get(key,(error: any, data: any) => {
        if (error) {
            res.status(400).send({
                ok: false,
                message: error,
            });
        }
        if (data !== null) {
            console.log('data from redis!');
            res.status(200).send({
                ok: true,
                data: JSON.parse(data),
            });
        } else next();
    })
};

module.exports = {
    redisClient,
    set,
    get,
};