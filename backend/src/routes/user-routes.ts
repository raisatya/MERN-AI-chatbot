import { Router } from "express";
import { currentUserRouter, userSigninRouter, userSignoutRouter, userSignupRouter } from "../controllers/user-controllers";
import { loginValidator, signupValidator, validate } from "../utils/validators";

const userRoutes = Router();

userRoutes.post('/signin', validate(loginValidator), userSigninRouter);
userRoutes.post('/signup', validate(signupValidator), userSignupRouter);
userRoutes.post('/signout', userSignoutRouter);
userRoutes.get('/currentuser', currentUserRouter);

export default userRoutes;