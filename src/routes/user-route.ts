import {UserService} from "../service/user.service";

const express = require('express')
const router = express.Router()
import passport from 'passport';
const authJWT = require('../utils/auth-jwt')
const userService = new UserService()

router.get('/api/v1/users',passport.authenticate('jwt', {session : false}), userService.getAllUser)
router.get('/api/v1/user',passport.authenticate('jwt', {session : false}),userService.getUserById)
router.post('/api/v1/user/join', userService.createUser)
router.post('/api/v1/user/login', userService.login)
router.patch('/api/v1/user/update', passport.authenticate('jwt', {session : false}), userService.updateUserById)
router.delete('/api/v1/user/delete',passport.authenticate('jwt', {session : false}),userService.deleteUserById)

module.exports = router;