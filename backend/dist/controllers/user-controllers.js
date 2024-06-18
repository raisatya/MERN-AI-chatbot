"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userSignin = exports.userSignup = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const constants_1 = require("../utils/constants");
const Password_1 = require("../utils/Password");
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userJwt = jwt.sign({
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
exports.userSignup = userSignup;
const userSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userJwt = jwt.sign({
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email
        }, process.env.JWT_SECRET);
        res.cookie(constants_1.COOKIE_NAME, { jwt: userJwt }, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
        });
        return res
            .status(200)
            .json({ message: "OK", name: existingUser.name, email: existingUser.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "SOMETHING WENT WRONG" });
    }
});
exports.userSignin = userSignin;
