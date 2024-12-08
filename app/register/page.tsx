"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import useSessionStore from "@/store/useSessionStore";
import { useToast } from "@/hooks/use-toast";
import { createAdminClient } from "@/utils/supabase/server";

const formSchema = z.object({
  // username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { session, setSession } = useSessionStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // username: "",
      email: "",
      password: "",
      terms: false,
    },
  });
  const supabase = createClient();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      // options: {
      //   emailRedirectTo: 'https://example.com/welcome',

      // },
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
      return;
    }
    // const { data: data2, error: error2 } = await supabase
    //   .from("users")
    //   .insert([{ user_name: values.username }]);
    // if (error2) {
    //   const adminSupabase = await createAdminClient();
    //   if (data.user) {
    //     await adminSupabase.auth.admin.deleteUser(data.user?.id);
    //     await supabase.auth.signOut();
    //   }

    //   toast({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description: error2.message,
    //   });
    //   return;
    // }
    setSession(data.session);
  }
  if (session) redirect("/");
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-[#39FF14]">
            Create an Account
          </h1>
          <p className="text-gray-400">Enter your details to register</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the{" "}
                      <Link
                        href="/terms"
                        className="text-[#39FF14] hover:underline"
                      >
                        terms and conditions
                      </Link>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
            >
              Register
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#39FF14] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
