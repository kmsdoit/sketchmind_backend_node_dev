import passport from "passport";
import User from "../models/user";
import local from './localStrategy'

export default () => {
    passport.serializeUser((user:any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id: number, done) => {
        User.findOne({
            where: { id }
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
};