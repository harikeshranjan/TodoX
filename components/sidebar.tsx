"use client";

import React, { useEffect, useState } from 'react';
import { Home, Calendar, Flag, ChevronDown, ChevronRight, Plus, LogOut, Star, CalendarRange } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent } from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useSidebar } from '@/hooks/use-sidebar';
import { ModeToggle } from './mode-toggle';
import { usePathname, useRouter } from 'next/navigation';
import LinkButton from './link-button';
import Link from 'next/link';
import { toast } from 'sonner';
import { signOut, useSession } from 'next-auth/react';

interface Task {
  _id: string;
  title: string;
  dueDate: Date;         
  priority: string;
  completed: boolean;
  tags?: string[];
}

export default function Sidebar() {
  const { data, status } = useSession();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, isDesktop } = useSidebar();
  const [isPrioritiesOpen, setIsPrioritiesOpen] = useState<boolean>(true);
  const [isTagOpen, setIsTagOpen] = useState<boolean>(false);
  const [loadTags, setLoadTags] = useState<boolean>(false);
  const [distinctTags, setDistinctTags] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }

    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [isDesktop, setIsSidebarOpen, pathname, status]);


  useEffect(() => {
    const fetchAllDistinctTags = async () => {
      setLoadTags(true);
      try {
        const response = await fetch(`/api/tasks`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          toast("Error", {
            description: "Failed to fetch tags",
            duration: 5000,
          });
          return;
        }
  
        const data = await response.json();  
        const tasks = Array.isArray(data.tasks) ? data.tasks : [];
        const distinctTags = [...new Set(tasks.flatMap((task: Task) => task.tags || []))];
  
        setDistinctTags(distinctTags as string[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadTags(false);
      }
    };
  
    fetchAllDistinctTags();
  }, []);  

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <aside className={`h-screen w-72 md:w-64 bg-background border-r p-4 flex flex-col fixed top-0 left-0 z-10 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className={`absolute top-4 right-4 cursor-pointer ${isDesktop ? 'hidden' : ''}`} onClick={toggleSidebar}>
        <Button variant="ghost" className="w-full justify-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </Button>
      </div>

      <div className="flex items-center mb-1">
        <h2 className="w-full text-3xl font-bold text-primary text-center">
          Todo<span className="text-blue-500">X</span>
        </h2>
      </div>

      <Separator className="my-2" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="space-y-1 py-1">
          <LinkButton href="/home" isActiveLink={isActiveLink}>
            <Home size={18} />
            <span>Home</span>
          </LinkButton>
        </div>

        <Separator className="my-2" />

        {/* Priorities Section */}
        <Collapsible
          open={isPrioritiesOpen}
          onOpenChange={setIsPrioritiesOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Star size={18} />
                <span className="font-medium">
                  Priorities
                </span>
              </div>
              {isPrioritiesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1">
            <LinkButton href="/priority/high" isActiveLink={isActiveLink}>
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>
                High
              </span>
            </LinkButton>
            <LinkButton href="/priority/medium" isActiveLink={isActiveLink}>
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>
                Medium
              </span>
            </LinkButton>
            <LinkButton href="/priority/low" isActiveLink={isActiveLink}>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>
                Low
              </span>
            </LinkButton>
            {/* <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground py-1 h-8">
            <Plus size={16} />
            <span>Add Priority</span>
          </Button> */}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-2" />

        <Collapsible
          open={isTagOpen}
          onOpenChange={setIsTagOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Flag size={18} />
                <span className="font-medium">
                  Tags
                </span>
              </div>
              {isTagOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-8 space-y-1">
            {loadTags ? (
              <span>Loading...</span>
            ) : (
              distinctTags.map((tag, index) => (
                <LinkButton key={index} href={`/tags/${tag}`} isActiveLink={isActiveLink}>
                  <div className="w-2 h-2 rounded-full border-2 border-white" />
                  <span>{capitalize(tag)}</span>
                </LinkButton>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-2" />

        {/* Today Section */}
        <div className="space-y-1 py-2">
          <LinkButton href="/today" isActiveLink={isActiveLink}>
            <Calendar size={18} />
            <span>
              Today
            </span>
          </LinkButton>

          {/* Overdue Section */}

          <LinkButton href="/overdue" isActiveLink={isActiveLink}>
            <CalendarRange size={18} />
            <span>
              Overdue
            </span>
          </LinkButton>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <Separator className="my-2" />
        <div className="space-y-1 py-2">
          <Link href={'/add-task'} className="w-full flex justify-center items-center gap-2 font-medium rounded-md py-1.5 text-white bg-neutral-900 hover:bg-neutral-900/90 dark:bg-white/85 dark:text-black">
            <Plus size={16} />
            <span>
              Add Task
            </span>
          </Link>
        </div>

        {/* setting button */}
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full h-12 gap-2 border">
              <div className='w-full flex justify-between items-center gap-2'>
                <div className='flex items-center justify-end gap-4'>
                  <span
                    className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg uppercase">{data?.user?.username?.charAt(0) || '?'}</span>
                  <span className='overflow-hidden'>{data?.user.username}</span>
                </div>
                <div className='w-8 h-8 flex flex-col gap-1 items-center justify-center'>
                  <span className="w-0.5 h-0.5 rounded-full bg-black dark:bg-white"></span>
                  <span className="w-0.5 h-0.5 rounded-full bg-black dark:bg-white"></span>
                  <span className="w-0.5 h-0.5 rounded-full bg-black dark:bg-white"></span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <Button
              variant="ghost"
              className="w-full gap-2 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => signOut()}
            >
              <LogOut size={16} />
              <span>
                Logout
              </span>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}