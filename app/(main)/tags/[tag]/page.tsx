"use client";

import TaskCard from "@/components/task-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Task {
  _id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
  completed: boolean;
}

export default function DynamicTags({ params }: { params: Promise<{ tag: string }> }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setTag(resolvedParams.tag);
    });
  }, [params]);

  useEffect(() => {
    if (!tag) return;

    const fetchTasksByTag = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/tasks/tags/${tag}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          toast("Error", {
            description: "Failed to fetch tasks",
            duration: 5000, 
          });
          return;
        }

        const data = await response.json();
        setTasks(data); // Store fetched tasks in state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksByTag();
  }, [tag]);

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
    <section className="min-h-screen ml-0 md:ml-64 mt-16 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="text-4xl font-bold text-blue-500">
          {`Tag: ${tag}`}
        </div>
      </div>

      {loading ? (
        <div className="text-2xl mt-8">Loading...</div>
      ) : (
        tasks.length === 0 ? (
          <div className="text-lg mt-8">
            No tasks
          </div>
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
  );
}
