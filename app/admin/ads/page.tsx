import CreateAds from "@/components/admin/create-ads";
import Ads from "@/components/ads";
import { Database } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

type Ad = Database["public"]["Tables"]["ads"]["Row"];
const page = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("ads").select();

  if (error) return <div>something went wrong</div>;
  return (
    <>
      <CreateAds />
      <div className="my-4">
      <h2 className="text-xl font-bold my-4">Existing Ads</h2>
        <div className="flex flex-wrap gap-3 justify-evenly">

        {(data as Ad[]).map((ad) => (
          <Ads key={ad.id} {...ad} />
        ))}
        </div>
      </div>
    </>
  );
};

export default page;
