"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema.schemas";

import { useState } from "react";

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 animate-fade-in">
      <div className="relative w-full max-w-md p-8 space-y-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-white drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="mb-6 text-blue-100">
            Sign in to continue your secret conversations
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <Input
                    {...field}
                    className="peer bg-transparent border-b-2 border-blue-300 focus:border-blue-500 text-white placeholder-transparent focus:outline-none transition-all duration-300"
                    placeholder="Email"
                  />
                  <FormLabel className="absolute left-0 -top-5 text-blue-200 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-focus:-top-5 peer-focus:text-blue-200">
                    {/* Email */}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <Input
                    type="password"
                    {...field}
                    className="peer bg-transparent border-b-2 border-blue-300 focus:border-blue-500 text-white placeholder-transparent focus:outline-none transition-all duration-300"
                    placeholder="Password"
                  />
                  <FormLabel className="absolute left-0 -top-5 text-blue-200 text-sm transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-400 peer-focus:-top-5 peer-focus:text-blue-200">
                    {/* Password */}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              type="submit"
              disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4 flex flex-col gap-2">
          <p>
            Not a member yet?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
          <p>
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-600 underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
