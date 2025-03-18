"use client";

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageToggle from '@/components/language-toggle';
import { toast } from 'sonner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { language } = useLanguage();

  useEffect(() => {
    document.title = "TodoX | Login";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/home';
      } else {
        const error = await response.json();
        toast("Error", {
          description: error.message,
          duration: 5000,
        });
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
            {language === 'en' ? `Welcome back! Please log in to continue` : `Tekrar hoşgeldiniz! Devam etmek için giriş yapın`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'en' ? 'Email' : 'E-posta'}
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
                  {language === 'en' ? 'Password' : 'Şifre'}
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
                  {language === 'en' ? 'Forgot password?' : 'Şifremi unuttum'}
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full">
              {language === 'en' ? 'Sign In' : 'Giriş Yap'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Don\'t have an account?' : 'Hesabını yok mu?'}{' '}
            <Link href="/register" className="text-primary hover:underline">
              {language === 'en' ? 'Create one' : 'Oluştur'}
            </Link>
          </p>

          <Separator className="mx-2" />

          <div className='flex space-x-2'>
            <ModeToggle />
            <LanguageToggle />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;