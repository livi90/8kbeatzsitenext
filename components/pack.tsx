"use client";
import { Database } from "@/lib/schema";
import { Box } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { deletePack } from "@/app/actions/db";
import useSessionStore from "@/store/useSessionStore";
type Pack = Database["public"]["Tables"]["packs"]["Row"];

const Pack = (pack: Pack) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionStore();
  const isAdmin = session?.user?.user_metadata.role === "admin";

  async function handleDelete() {
    setIsLoading(true);
    try {
      const result = await deletePack(pack.id);
      if (result.error) throw new Error(result.error);
      toast({
        description: "The sample pack has been deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: (
          <ToastAction onClick={handleDelete} altText="Try again">
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-3 w-full max-w-[400px] p-3 rounded-md text-sm bg-slate-700">
      <Box />
      <h1 className="font-bold text-lg">{pack.name}</h1>
      <span>{pack.description}</span>
      {pack.download_url ? (
        <Link href={pack.download_url}>Download Link</Link>
      ) : (
        <Link
          href={"/login"}
          className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
        >
          Login
        </Link>
      )}
      {isAdmin && (
        <div className="self-end">
          <Button disabled={isLoading} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pack;
