"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user-controllers");
const validators_1 = require("../utils/validators");
const userRoutes = (0, express_1.Router)();
userRoutes.post('/signin', (0, validators_1.validate)(validators_1.loginValidator), user_controllers_1.userSignin);
userRoutes.post('/signup', (0, validators_1.validate)(validators_1.signupValidator), user_controllers_1.userSignup);
exports.default = userRoutes;
