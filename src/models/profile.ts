import Sequelize, {
    CreationOptional, InferAttributes, InferCreationAttributes, Model,
    BelongsToManyAddAssociationMixin,
    NonAttribute,ForeignKey
} from 'sequelize';
import {sequelize} from "./index";
import User from './user';

class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
    declare id : CreationOptional<number>;

    declare relation : string;
    declare name : string;

    declare birth : string;

    declare gender : string;

    declare education : string;

    declare educationStatus : string;

    declare country : string;

    declare city : string;

    declare job : string;
    declare UserId: ForeignKey<User['id']>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;

    static initiate(sequelize: Sequelize.Sequelize) {
        Profile.init({
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            relation : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            birth : {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            gender : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            education : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            educationStatus : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            country : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            city : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            job : {
                type: Sequelize.STRING(15),
                allowNull: false,
            },

            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Profile',
            tableName: 'profiles',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate() {
        Profile.belongsTo(User);
    }
}

export default Profile
