"use client"

import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

interface Task {
  _id: string,
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
  completed: boolean;
}

interface TaskContextType {
  task: Task;
  setTask: Dispatch<SetStateAction<Task>>;
}

const TaskContext = createContext<TaskContextType>({
  task: {
    _id: "",
    title: "",
    dueDate: new Date(),
    priority: "low",
    tags: [],
    completed: false
  },
  setTask: () => {}
})

export const useTask = () => {
  return useContext(TaskContext)
}

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [task, setTask] = useState<Task>({
    _id: "",
    title: "",
    dueDate: new Date(),
    priority: "low",
    tags: [],
    completed: false
  })

  return (
    <TaskContext.Provider value={{ task, setTask }}>
      {children}
    </TaskContext.Provider>
  )
}