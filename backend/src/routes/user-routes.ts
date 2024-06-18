import { Router } from "express";
import { userSignin, userSignup } from "../controllers/user-controllers";
import { loginValidator, signupValidator, validate } from "../utils/validators";

const userRoutes = Router();

userRoutes.post('/signin', validate(loginValidator), userSignin);
userRoutes.post('/signup', validate(signupValidator), userSignup);

export default userRoutes;