"use client";
import { Database } from "@/lib/schema";
import { Music, Eye, MousePointer, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { deleteAds } from "@/app/actions/db";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";

type Ads = Database["public"]["Tables"]["ads"]["Row"];

const Ads = (ads: Ads) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  async function handleDelete() {
    setIsLoading(true);
    try {
      const result = await deleteAds(ads.id);
      if (result.error) throw new Error(result.error);
      toast({
        description: "Ad has been deleted.",
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
    <div className="w-full max-w-[400px] relative overflow-hidden bg-white rounded-xl shadow-lg my-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image
          src={ads.image_url}
          alt="Advertisement"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Views Stats */}
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{ads.views || 0}</span>
            </div>
            {/* Clicks Stats */}
            <div className="flex items-center gap-2 text-gray-600">
              <MousePointer className="w-4 h-4" />
              <span className="text-sm font-medium">{ads.clicks || 0}</span>
            </div>
          </div>

          {/* CTR (Click-Through Rate) */}
          <div className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
            CTR:{" "}
            {ads.views ? (((ads.clicks || 0) / ads.views) * 100).toFixed(1) : 0}
            %
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-sm">
        Active
      </div>
    </div>
  );
};

export default Ads;
