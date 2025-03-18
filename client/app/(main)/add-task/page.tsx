"use client";

import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";
import { PlusCircle, Calendar as CalendarIcon, Tag } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddTask() {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    dueDate: Date.now(),
    priority: "",
    tags: [] as string[],
  });

  const translations = {
    addTask: language === "en" ? "Add Task" : "Görev Ekle",
    taskTitle: language === "en" ? "Task Title" : "Görev Başlığı",
    taskDescription: language === "en" ? "Description" : "Açıklama",
    dueDate: language === "en" ? "Due Date" : "Bitiş Tarihi",
    priority: language === "en" ? "Priority" : "Öncelik",
    tags: language === "en" ? "Tags" : "Etiketler",
    addTags: language === "en" ? "Add tags" : "Etiket ekle",
    high: language === "en" ? "High" : "Yüksek",
    medium: language === "en" ? "Medium" : "Orta",
    low: language === "en" ? "Low" : "Düşük",
    pickDate: language === "en" ? "Pick a date" : "Tarih seçin",
    add: language === "en" ? "Add" : "Ekle",
    enterTag: language === "en" ? "Enter tag" : "Etiket girin",
  };

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        toast(language === "en" ? "Task added successfully" : "Görev başarıyla eklendi", {
          description: language === "en" ? "You can view it in the tasks page" : "Görevler sayfasında görebilirsiniz",
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
        toast(language === "en" ? "An error occurred" : "Bir hata oluştu", {
          description: language === "en" ? "Please try again later" : "Lütfen daha sonra tekrar deneyin",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section className="min-h-screen ml-0 md:ml-64 mt-16 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="text-4xl font-bold text-blue-500">
            {translations.addTask}
          </div>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">{translations.taskTitle}</Label>
                  <Input
                    id="title"
                    placeholder={translations.taskTitle}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* Due Date and Priority row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>{translations.dueDate}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>{translations.pickDate}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setFormData({
                              ...formData,
                              dueDate: selectedDate ? selectedDate.getTime() : Date.now(),
                            });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label>{translations.priority}</Label>
                    <Select
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={translations.priority} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                            {translations.high}
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                            {translations.medium}
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                            {translations.low}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>{translations.tags}</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {`✕`}
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder={translations.enterTag}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      {translations.add}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {translations.addTask}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}