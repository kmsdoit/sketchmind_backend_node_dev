import configObj from '../config/config';
import Sequelize from 'sequelize';
import User from "./user";
import Profile from "./profile"


const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
const config = configObj[env];


export const sequelize = new Sequelize.Sequelize(
    config.database, config.username, config.password, config,
);

Profile.initiate(sequelize)
User.initiate(sequelize)

User.associate();
Profile.associate();
