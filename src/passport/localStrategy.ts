const passport = require('passport')
import {Strategy as LocalStrategy} from 'passport-local';
import User from '../models/user';
const bcrypt = require('bcrypt')
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


export default () => {
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async (email,password, done) => {
        try{
            const exUser = await User.findOne({ where : {email} });
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                console.log(result)
                if(result) {
                    done(null , exUser)
                }else {
                    done(null, false , {message : '비밀번호가 일치하지 않습니다'});
                }
            }else {
                done(null,false,{message : '가입되지 않은 회원입니다'})
            }
        }catch (error) {
            console.error(error)
            done(error)
        }
    }))

    // JWT Strategy
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : process.env.JWT_SECRET
        },
        function (jwtPayload : any, done : any) {
            return User.findOne({where : {id : jwtPayload.id}})
                .then(user => {
                    console.log(user)
                    return done(null, user);
                })
                .catch(err => {
                    console.log(err)
                    return done(err);
                });
        }
    ));
}