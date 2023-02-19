import {UserService} from "../service/user.service";

const express = require('express')
const router = express.Router()

const userService = new UserService()

router.get('/api/v1/users', userService.getAllUser)
router.post('/api/v1/user/login', userService.login)
router.post('/api/v1/user/join', userService.createUser)

module.exports = router;