import e, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import TaskModel from "../models/tasks";
import { Types, Document } from "mongoose";

interface Task {
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
  completed: boolean;
  author: Types.ObjectId;
}

const router = Router();
const secret = process.env.JWT_SECRET as string;

interface CustomJwtPayloadTask extends JwtPayload {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
  completed: boolean;
  author: Types.ObjectId;
}

router.use(cookieParser());

// add a new task
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    jwt.verify(token, secret, {}, async (err, decoded) => {
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

      const info = decoded as CustomJwtPayloadTask;
      if (!info) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const newTask = await TaskModel.create({
        title,
        dueDate,
        priority,
        tags,
        completed,
        author: info.id,
      });

      res.status(201).json(newTask);
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get all tasks
router.get("/all", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    jwt.verify(token, secret, {}, async (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const info = decoded as CustomJwtPayloadTask;
      if (!info) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const tasks = await TaskModel.find({ author: info.id });

      res.status(200).json(tasks);
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get a task by id
router.get("/by-user/:userId", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { userId } = req.params;

    if (userId !== decoded.id) {
      res.status(401).json({ message: "Forbidden! You can only access your own tasks" });
      return;
    }

    const tasks = await TaskModel.find({ author: userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

// update task completion status
router.put("/toggle-complete/:taskId", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;
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

    const task = await TaskModel.findById(taskId) as Document<unknown, {}, Task> & Task;
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.author.toString() !== decoded.id) {
      res.status(403).json({ message: "Forbidden! You can only update your own tasks" });
      return;
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { completed }, { new: true });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

// get tasks with due date for today
router.get("/today", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;
    if (!decoded?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    const tasks = await TaskModel.find({
      author: decoded.id, // Ensure only fetching tasks for the logged-in user
      dueDate: { $gte: today, $lt: tomorrow },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
});

// Get tasks by tag
router.get("/tags/:tag", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { tag } = req.params;

    // Find tasks where the given tag exists in the tags array
    const tasks = await TaskModel.find({
      author: decoded.id,  // Ensure the user only fetches their own tasks
      tags: tag,           // MongoDB will match tasks where `tag` exists in `tags` array
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// Get all overdue tasks (tasks with dueDate in the past)
router.get("/overdue", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const now = new Date();

    const overdueTasks = await TaskModel.find({
      author: decoded.id,
      dueDate: { $lt: now }, // Find tasks where dueDate is less than the current date
      completed: false, // Optional: Only show overdue tasks that are not completed
    });

    res.status(200).json(overdueTasks);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


// update a task by id
router.put("/update/:taskId", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;

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

    const task = await TaskModel.findById(taskId) as Document<unknown, {}, Task> & Task;
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.author.toString() !== decoded.id) {
      res.status(403).json({ message: "Forbidden! You can only update your own tasks" });
      return;
    }

    const updatedTask = await TaskModel.findByIdAndUpdate({
      taskId,
    }, {
      title,
      dueDate,
      priority,
      tags,
      completed,
    }, { new: true })

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// delete a task by id
router.delete("/delete/:taskId", async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, secret) as CustomJwtPayloadTask;
    if (!decoded || !decoded.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId) as Document<unknown, {}, Task> & Task;
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.author.toString() !== decoded.id) {
      res.status(403).json({ message: "Forbidden! You can only delete your own tasks" });
      return;
    }

    await TaskModel.findByIdAndDelete(taskId);

    res.status(204).json({ message: "Task deleted successfully" });
  }
  catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;