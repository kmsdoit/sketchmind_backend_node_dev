import configObj from '../config/config';
import Sequelize from 'sequelize';
import User from "./user";


const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
const config = configObj[env];


export const sequelize = new Sequelize.Sequelize(
    config.database, config.username, config.password, config,
);

User.initiate(sequelize)