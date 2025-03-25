"use client";

import SplashScreen from "@/components/splash-screen";
import TaskCard from "@/components/task-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  tags: string[];
  dueDate: Date;
  completed: boolean;
};

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && status !== "loading") {
      const fetchTasks = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/tasks`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }

          const data = await response.json();
          setTasks(data.tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
          toast("Failed to fetch tasks", { duration: 5000 });
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [showSplash, status]);

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
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <section className="min-h-screen ml-0 md:ml-64 mt-20 flex flex-col items-center px-8">
          <div className="w-full max-w-5xl">
            <div className="text-4xl font-bold text-blue-500">Tasks</div>
          </div>
          {loading ? (
            <div className="text-center py-12">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-28 mb-4" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 w-full max-w-5xl mx-auto py-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  id={task._id} {...task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center space-y-5 py-12">
                  <div className="text-2xl font-bold">No tasks found</div>
                  <Button variant="outline" size="lg" className="w-48 mx-auto" onClick={() => router.push("/add-task")}>
                    Create Task
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
