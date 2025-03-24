"use client";

import TaskCard from "@/components/task-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  tags: string[];
  dueDate: Date;
  completed: boolean;
}

export default function MediumPriority() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMediumPriorityTasks = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/tasks/priority/medium`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          toast("Failed to fetch medium priority tasks", {
            description: "Please try again later",
            duration: 5000
          });
        } else {
          const data = await response.json();
          const mediumPriorityTasks = data.filter((task: Task) => task.priority === "medium");
          // Convert dueDate strings to Date objects
          setTasks(mediumPriorityTasks.map((task: Task) => ({ ...task, dueDate: new Date(task.dueDate) })));
        }
      } catch (error) {
        console.error("Error fetching medium priority tasks:", error);
        toast("Failed to fetch medium priority tasks", {
          description: "Please try again later",
          duration: 5000
        });
      }
      finally {
        setLoading(false);
      }
    }

    fetchMediumPriorityTasks();
  }, []);

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const prevTasks = [...tasks];
    setTasks(tasks.map((task) => (task._id === id ? { ...task, completed } : task)));
  
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed }),
      });
  
      if (!response.ok) throw new Error("Failed to toggle completion");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast("Failed to toggle task completion", { duration: 5000 });
      setTasks(prevTasks);
    }
  };  

  const handleDelete = async (id: string) => {
    const prevTasks = [...tasks];
    setTasks(tasks.filter((task) => task._id !== id));
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete task");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast("Failed to delete task", { duration: 5000 });
      setTasks(prevTasks);
    }
  };

  return (
    <section className="min-h-screen ml-0 md:ml-64 mt-20 flex flex-col items-center px-8">
      <div className="w-full max-w-5xl">
        <div className="text-4xl font-bold text-blue-500">
          Medium Priority Tasks
        </div>
      </div>

      {loading ? (
        <div className="text-2xl mt-8">Loading...</div>
      ) : (
        tasks.length === 0 ? (
          <div className="text-2xl mt-8">No medium priority tasks</div>
        ) : (
          <div className="w-full md:w-[85%] flex flex-col space-y-4 mt-8">
            {tasks.map((task, index) => (
              <TaskCard
                key={index}
                id={task._id}
                title={task.title}
                dueDate={task.dueDate}
                completed={task.completed}
                priority={task.priority}
                tags={task.tags}
                onDelete={() => handleDelete(task._id)}
                onToggleComplete={handleToggleComplete}
              />
            ))
            }
          </div>
        ))}
    </section>
  )
}