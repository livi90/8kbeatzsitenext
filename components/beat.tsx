"use client";
import { Database } from "@/lib/schema";
import { Music } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteBeat } from "@/app/actions/db";
import { ToastAction } from "./ui/toast";
import Image from "next/image";
import useSessionStore from "@/store/useSessionStore";
type Beat = Database["public"]["Tables"]["beats"]["Row"];

const Beat = (beat: Beat) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useSessionStore();
  const isAdmin = session?.user?.user_metadata.role === "admin"; // TODO: Replace with actual auth check

  async function handleDelete() {
    setIsLoading(true);
    try {
      const result = await deleteBeat(beat.id);
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
    <div
      className="relative flex flex-col gap-3 w-full max-w-[400px] p-6 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${beat.image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Music className="w-6 h-6 text-white/80" />
          <h1 className="font-bold text-lg text-white">{beat.name}</h1>
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <span className="bg-white/10 px-3 py-1 rounded-full">
            {beat.genere}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full">
            {beat.bpm} BPM
          </span>
        </div>

        {beat.download_url ? (
          <Link
            href={beat.download_url}
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
          >
            Download Link
          </Link>
        ) : (
          <Link
            href={"/login"}
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
          >
            Login
          </Link>
        )}

        <div className="self-end mt-2">
          {isAdmin && (
            <Button
              disabled={isLoading}
              onClick={handleDelete}
              variant="destructive"
              className="hover:bg-red-600 transition-colors"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Beat;
