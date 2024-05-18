"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function SignInComponent() {
  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const [signinData, setSigninData] = useState({ email: "", password: "" });

  const handleChangeSignup = (e) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value });
  };

  const handleChangeSignin = (e) => {
    setSigninData({ ...signinData, [e.target.id]: e.target.value });
  };

  const submitHandlerSignup = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const submitHandlerSignin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signinData.email,
          password: signinData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = "/home";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
        <CardDescription>Sign up or sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs className="space-y-4" defaultValue="signup">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    type="email"
                    value={signupData.email}
                    onChange={handleChangeSignup}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signupData.password}
                    onChange={handleChangeSignup}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={submitHandlerSignup}>
                Sign Up
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="signin">
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  value={signinData.email}
                  onChange={handleChangeSignin}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={signinData.password}
                  onChange={handleChangeSignin}
                />
              </div>
              <div>
                <Button className="w-full" onClick={submitHandlerSignin}>
                  Sign In
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
