"use client";

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ModeToggle } from '@/components/mode-toggle';
import { signIn } from 'next-auth/react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    document.title = "TodoX | Login";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (response?.error) {
        toast("Error", {
          description: "Invalid email or password",
          duration: 5000,
        });
      } else {
        toast("Success", {
          description: "Logged in successfully",
          duration: 5000,
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">
            Todo<span className='text-blue-500'>X</span>
          </CardTitle>
          <CardDescription className="text-center">
          Welcome back! Please log in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="focus:ring-2 focus:ring-primary"
              />
              <div className='flex justify-end'>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account? {' '}
            <Link href="/register" className="text-primary hover:underline">
              Create Account
            </Link>
          </p>

          <Separator className="mx-2" />

          <div className='flex space-x-2'>
            <ModeToggle />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;