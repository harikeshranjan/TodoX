"use client";

import { useState } from "react";
import { PlusCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddTask() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    dueDate: Date.now(),
    priority: "",
    tags: [] as string[],
  });

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setFormData({ ...formData, tags: newTags });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        toast("Task added successfully", {
          description: "You can view it in the tasks page",
          duration: 5000,
        });
        setFormData({
          title: "",
          dueDate: Date.now(),
          priority: "",
          tags: [],
        });
        setTags([]);
        setDate(undefined);
      } else {
        toast("An error occurred", {
          description: "Please try again later",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="min-h-screen ml-0 md:ml-64 mt-16 md:mt-10 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="text-4xl font-bold text-blue-500">Add Task</div>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Task Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Due Date and Priority row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Due Date - Raw Implementation */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={date ? format(date, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setDate(selectedDate);
                        setFormData({
                          ...formData,
                          dueDate: selectedDate.getTime(),
                        });
                      }}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-2 w-full">
                    <Label>Priority</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high" className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-red-500"/>
                          <p>High</p>
                        </SelectItem>
                        <SelectItem value="medium">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"/>
                          <p>Medium</p>
                        </SelectItem>
                        <SelectItem value="low">
                          <span className="w-2 h-2 rounded-full bg-green-500"/>
                          <p>Low</p>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Tag className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}