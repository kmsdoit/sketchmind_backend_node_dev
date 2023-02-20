import { promisify } from "util";

const jwt = require('jsonwebtoken')
const { redisClient } = require('../utils/redis');

module.exports = {
    sign: (user : any) => {
        const payload = {
            id: user.id,
            role: user.role,
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h',
            issuer: 'sketchmind',
        });
    },
    verify: (token: string) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            return {
                ok: true,
                id: decoded.id,
                role: decoded.role,
            };
        } catch (err : any) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => {
        return jwt.sign({}, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '14d',
            issuer: 'sketchmind',
        });
    },
    refreshVerify: async (token : string, username : string) => {
        const getAsync = promisify(redisClient.get).bind(redisClient);
        try {
            const data = await getAsync(username);
            if (token === data) {
                return {
                    ok: true,
                };
            } else {
                return {
                    ok: false,
                };
            }
        } catch (err) {
            return {
                ok: false,
            };
        }
    },
}