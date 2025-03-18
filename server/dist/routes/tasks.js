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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tasks_1 = __importDefault(require("../models/tasks"));
const router = (0, express_1.Router)();
const secret = process.env.JWT_SECRET;
router.use((0, cookie_parser_1.default)());
// add a new task
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        jsonwebtoken_1.default.verify(token, secret, {}, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const { title, dueDate, priority, tags, completed = false } = req.body;
            if (!title || !dueDate || !tags || !Array.isArray(tags)) {
                res.status(400).json({ message: "All fields are required and tags must be an array" });
                return;
            }
            if (!["low", "medium", "high"].includes(priority)) {
                return res.status(400).json({ message: "Invalid priority value" });
            }
            const info = decoded;
            if (!info) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const newTask = yield tasks_1.default.create({
                title,
                dueDate,
                priority,
                tags,
                completed,
                author: info.id,
            });
            res.status(201).json(newTask);
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// get all tasks
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        jsonwebtoken_1.default.verify(token, secret, {}, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const info = decoded;
            if (!info) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const tasks = yield tasks_1.default.find({ author: info.id });
            res.status(200).json(tasks);
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// get a task by id
router.get("/by-user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { userId } = req.params;
        if (userId !== decoded.id) {
            res.status(401).json({ message: "Forbidden! You can only access your own tasks" });
            return;
        }
        const tasks = yield tasks_1.default.find({ author: userId });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error });
    }
}));
// update task completion status
router.put("/toggle-complete/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { taskId } = req.params;
        const { completed } = req.body;
        if (completed === undefined) {
            res.status(400).json({ message: "completed field is required" });
            return;
        }
        const task = yield tasks_1.default.findById(taskId);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        if (task.author.toString() !== decoded.id) {
            res.status(403).json({ message: "Forbidden! You can only update your own tasks" });
            return;
        }
        const updatedTask = yield tasks_1.default.findByIdAndUpdate(taskId, { completed }, { new: true });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error });
    }
}));
// get tasks with due date for today
router.get("/today", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
        const tasks = yield tasks_1.default.find({
            author: decoded.id, // Ensure only fetching tasks for the logged-in user
            dueDate: { $gte: today, $lt: tomorrow },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
        return;
    }
}));
// Get tasks by tag
router.get("/tags/:tag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { tag } = req.params;
        // Find tasks where the given tag exists in the tags array
        const tasks = yield tasks_1.default.find({
            author: decoded.id, // Ensure the user only fetches their own tasks
            tags: tag, // MongoDB will match tasks where `tag` exists in `tags` array
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}));
// Get all overdue tasks (tasks with dueDate in the past)
router.get("/overdue", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const now = new Date();
        const overdueTasks = yield tasks_1.default.find({
            author: decoded.id,
            dueDate: { $lt: now }, // Find tasks where dueDate is less than the current date
            completed: false, // Optional: Only show overdue tasks that are not completed
        });
        res.status(200).json(overdueTasks);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// update a task by id
router.put("/update/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { taskId } = req.params;
        const { title, dueDate, priority, tags, completed } = req.body;
        if (!title || !dueDate || !tags || !Array.isArray(tags) || !priority || completed === undefined) {
            res.status(400).json({ message: "All fields are required and tags must be an array" });
            return;
        }
        const task = yield tasks_1.default.findById(taskId);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        if (task.author.toString() !== decoded.id) {
            res.status(403).json({ message: "Forbidden! You can only update your own tasks" });
            return;
        }
        const updatedTask = yield tasks_1.default.findByIdAndUpdate({
            taskId,
        }, {
            title,
            dueDate,
            priority,
            tags,
            completed,
        }, { new: true });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// delete a task by id
router.delete("/delete/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { taskId } = req.params;
        const task = yield tasks_1.default.findById(taskId);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        if (task.author.toString() !== decoded.id) {
            res.status(403).json({ message: "Forbidden! You can only delete your own tasks" });
            return;
        }
        yield tasks_1.default.findByIdAndDelete(taskId);
        res.status(204).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.default = router;
