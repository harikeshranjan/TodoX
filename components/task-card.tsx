"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  tags: string[];
  dueDate?: Date;
  completed?: boolean;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function TaskCard({
  id = "task-1",
  title = "Complete project documentation",
  priority = "medium",
  tags = ["work", "documentation"],
  dueDate,
  completed = false,
  onToggleComplete = () => {},
  onDelete = () => {},
}: TaskCardProps) {
  const [isComplete, setIsComplete] = useState(completed);


  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const handleToggleComplete = () => {
    const newState = !isComplete;
    setIsComplete(newState);
    onToggleComplete(id, newState);
  };

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-md duration-200 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-neutral-700">
      <CardContent className="p-0">
        <div className="flex items-start px-4 gap-3">
          {/* Left: Checkbox and Priority Indicator */}
          <div className="flex flex-col items-center gap-2">
            <Checkbox
              checked={isComplete}
              onCheckedChange={handleToggleComplete}
              className="mt-1 h-5 w-5 text-primary border-2 border-primary rounded-full shadow-sm hover:border-gray-300"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      priorityColors[priority]
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{priority} priority</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Middle: Task Details */}
          <div className="flex-1">
            <h3
              className={cn(
                "font-medium text-base line-clamp-1",
                isComplete && "line-through text-muted-foreground"
              )}
            >
              {title}
            </h3>
            
            {/* Due Date */}
            {dueDate && (
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <CalendarClock className="h-3 w-3 mr-1" />
                <span>{format(dueDate, "PPP")}</span>
              </div>
            )}
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/30 cursor-pointer"
                    onClick={() => onDelete(id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}