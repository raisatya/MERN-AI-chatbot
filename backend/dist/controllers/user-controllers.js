"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserRouter = exports.userSignoutRouter = exports.userSigninRouter = exports.userSignupRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const constants_1 = require("../utils/constants");
const Password_1 = require("../utils/Password");
const userSignupRouter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const newUser = yield User_1.default.create({ name, email, password });
        res.clearCookie(constants_1.COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const userJwt = jsonwebtoken_1.default.sign({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }, process.env.JWT_SECRET);
        res.cookie(constants_1.COOKIE_NAME, { jwt: userJwt }, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
        });
        return res
            .status(201)
            .json({ message: "OK", name: newUser.name, email: newUser.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "SOMETHING WENT WRONG" });
    }
});
exports.userSignupRouter = userSignupRouter;
const userSigninRouter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ msg: "User not found" });
        }
        const passwordsMatch = yield Password_1.Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            return res.status(403).send("Incorrect Password");
        }
        res.clearCookie(constants_1.COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const userJwt = jsonwebtoken_1.default.sign({
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
        }, process.env.JWT_SECRET);
        res.cookie(constants_1.COOKIE_NAME, { jwt: userJwt }, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
        });
        return res
            .status(200)
            .json({
            message: "OK",
            name: existingUser.name,
            email: existingUser.email,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "SOMETHING WENT WRONG" });
    }
});
exports.userSigninRouter = userSigninRouter;
const userSignoutRouter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(constants_1.COOKIE_NAME, {
        httpOnly: true,
        domain: "localhost",
        signed: true,
        path: "/",
    });
    res.send({});
});
exports.userSignoutRouter = userSignoutRouter;
const currentUserRouter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send({ currentUser: req.currentUser || null });
});
exports.currentUserRouter = currentUserRouter;
