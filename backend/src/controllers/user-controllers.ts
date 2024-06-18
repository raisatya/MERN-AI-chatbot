import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import User from '../models/User';
import { COOKIE_NAME } from '../utils/constants';
import { Password } from '../utils/Password';

export const userSignup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) return res.status(401).send("User already registered");

      const newUser = await User.create({ name, email, password });

      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: "localhost",
        signed: true,
        path: "/",
      });

      const userJwt = jwt.sign(
        {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        process.env.JWT_SECRET!
      );

      res.cookie(
        COOKIE_NAME,
        { jwt: userJwt },
        {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "none",
        }
      );

      return res
        .status(201)
        .json({ message: "OK", name: newUser.name, email: newUser.email });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "SOMETHING WENT WRONG" });
    }
}


export const userSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }

        const passwordsMatch = await Password.compare(
          existingUser.password,
          password
        );

        if (!passwordsMatch) {
          return res.status(403).send("Incorrect Password");
        }

        res.clearCookie(COOKIE_NAME, {
          httpOnly: true,
          domain: "localhost",
          signed: true,
          path: "/",
        });

        const userJwt = jwt.sign(
          {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email
          },
          process.env.JWT_SECRET!
        );

        res.cookie(
          COOKIE_NAME,
          { jwt: userJwt },
          {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
          }
        );

        return res
          .status(200)
          .json({ message: "OK", name: existingUser.name, email: existingUser.email });

    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "SOMETHING WENT WRONG" });
    }
}


//userLogout and currentUserDetails routes