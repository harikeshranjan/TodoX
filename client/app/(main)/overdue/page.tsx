"use client";

import TaskCard from "@/components/task-card";
import { useLanguage } from "@/hooks/use-language";
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

export default function OverduePage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/overdue`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          toast(language === "en" ? "Failed to fetch tasks" : "Görevler alınamadı", {
            description: language === "en" ? "Failed to fetch tasks" : "Görevler alınamadı",
            duration: 5000,
          });
          return;
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOverdueTasks();
  }, [])

  const handleDelete = async (id: string) => {
    const prevTasks = [...tasks];
    setTasks(tasks.filter((task) => task._id !== id));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      toast(language === "en" ? "Task deleted" : "Görev silindi", { duration: 3000 });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast(language === "en" ? "Failed to delete task" : "Görev silinemedi", { duration: 5000 });
      setTasks(prevTasks);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const prevTasks = [...tasks];
    setTasks(tasks.map((task) => (task._id === id ? { ...task, completed } : task)));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/toggle-complete/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error("Failed to toggle completion");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast(language === "en" ? "Failed to toggle task completion" : "Görev değiştirilemedi", { duration: 5000 });
      setTasks(prevTasks);
    }
  };

  return (
    <section className="min-h-screen ml-0 md:ml-64 mt-16 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="text-4xl font-bold text-blue-500">
          {language === "en" ? "Overdue" : "Geciken"}
        </div>
      </div>

      {loading ? (
        <div className="text-2xl mt-8">{language === "en" ? "Loading..." : "Yükleniyor..."}</div>
      ) : (
        tasks.length === 0 ? (
          <div className="text-2xl mt-8">
            {language === "en" ? "No tasks for today" : "Bugün için görev yok"}
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
  )
}