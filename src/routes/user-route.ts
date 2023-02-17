import {UserService} from "../service/user.service";

const express = require('express')
const router = express.Router()

const userService = new UserService()

router.post('/user/join', userService.createUser)

module.exports = router;