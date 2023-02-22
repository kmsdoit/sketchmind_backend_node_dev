import {UserService} from "../service/user.service";

const express = require('express')
const router = express.Router()
import passport from 'passport';
const authJWT = require('../utils/auth-jwt')

module.exports = router;