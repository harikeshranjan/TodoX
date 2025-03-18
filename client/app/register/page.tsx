"use client";

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageToggle from '@/components/language-toggle';
import { useLanguage } from '@/hooks/use-language';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    document.title = "TodoX | Register";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast("Error", {
        description: language === 'en' ? 'Passwords do not match' : 'Şifreler uyuşmuyor',
        duration: 5000,
      });
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    })

    if (response.ok) {
      toast("Account created successfully", {
        description: language === 'en' ? 'You can now login to your account' : 'Artık hesabınıza giriş yapabilirsiniz',
        duration: 5000,
      });
      router.push('/login');
    } else {
      const data = await response.json();
      toast("Error", {
        description: data.message,
        duration: 5000,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">
            Todo<span className='text-blue-500'>X</span>
          </CardTitle>
          <CardDescription className="text-center">
            {language === 'en' ? 'Create your account to get started with TodoX' : `TodoX'u kullanmaya başlamak için hesabınızı oluşturun`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {language === 'en' ? 'First Name' : 'Ad'}
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {language === 'en' ? 'Last Name' : 'Soyad'}
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

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
              <Label htmlFor="password">
                {language === 'en' ? 'Password' : 'Şifre'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === 'en' ? 'Confirm Password' : 'Şifreyi Onayla'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full">
              {language === 'en' ? 'Create Account' : 'Hesap Oluştur'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center items-center space-y-5">
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Already have an account?' : 'Zaten bir hesabınız var mı?'}{' '}
            <Link href="/login" className="text-primary hover:underline">
              {language === 'en' ? 'Sign In' : 'Giriş Yap'}
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
}