"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/lib/schema";

type Ad = Database["public"]["Tables"]["ads"]["Row"];

type AdsProps = {
  position: string;
  interval?: number;
  className?: string;
};

export default function AdRotator({
  position,
  interval = 885000,
  className = "",
}: AdsProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAds() {
      const { data, error } = await supabase.from("ads").select("*");
      if (!error && data) {
        setAds(data);
      }
    }
    fetchAds();
  }, [position, supabase]);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) =>
        prevIndex === ads.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [ads.length, interval]);

  const trackView = useCallback(async (adId: number) => {
    const { data, error } = await supabase.rpc("increment_ad_views", {
      ad_id: adId,
    });
    console.log(data, error);
  }, [supabase]);

  const handleClick = useCallback(async (adId: number) => {
    await supabase.rpc("increment_ad_clicks", { ad_id: adId });
  }, [supabase]);

  useEffect(() => {
    if (ads[currentAdIndex]) {
      trackView(ads[currentAdIndex].id);
    }
  }, [currentAdIndex, ads, trackView]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div
      className={`relative w-full overflow-hidden bg-gray-100 min-h-[100px] ${className}`}
    >
      <Link
        href={currentAd.ad_link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick(currentAd.id)}
        className="block w-full h-full transition-transform duration-300 hover:scale-105"
      >
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={currentAd.image_url}
            alt="Advertisement"
            fill
            className="object-contain"
            priority={position === "header"}
          />
        </div>
      </Link>

      {ads.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300
                ${
                  index === currentAdIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
