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
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const salt = bcryptjs_1.default.genSaltSync(10);
const secret = process.env.JWT_SECRET;
router.use((0, cookie_parser_1.default)());
// add a new user
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        const newUser = user_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// login a user
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const isExistingUser = yield user_1.default.findOne({ email });
        if (!isExistingUser) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        const passOk = bcryptjs_1.default.compareSync(password, isExistingUser.password);
        if (!passOk) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const payload = {
            id: isExistingUser._id,
            firstName: isExistingUser.firstName,
            lastName: isExistingUser.lastName,
            email: isExistingUser.email,
            message: "LoginTrue",
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, {});
        res.cookie("token", token, { httpOnly: true }).json(payload);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// check if user is logged in
router.get('/is-logged-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        res.json(decoded);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}));
// get user profile
router.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.cookies;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = yield user_1.default.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}));
// logout a user
router.get('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});
exports.default = router;
