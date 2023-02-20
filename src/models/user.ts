import Sequelize, {
    CreationOptional, InferAttributes, InferCreationAttributes, Model,
    BelongsToManyAddAssociationMixin,
    NonAttribute,
} from 'sequelize';
import {sequelize} from "./index";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id : CreationOptional<number>;
    declare email : string;
    declare name : string;
    declare password : string;
    declare role : string;
    declare phone : string;
    declare sns_type : string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;

    static initiate(sequelize: Sequelize.Sequelize) {
        User.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            role : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            phone : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            sns_type : {
                type : Sequelize.STRING(100),
                allowNull : true
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

export default User
