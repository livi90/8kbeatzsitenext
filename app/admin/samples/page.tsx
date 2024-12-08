import CreatePack from "@/components/admin/create-pack";
import Pack from "@/components/pack";
import { Database } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

type Packs = Database["public"]["Tables"]["packs"]["Row"];
const page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from("packs").select();

  if (error) return <div>something went wrong</div>;
  return (
    <>
      <CreatePack />
      <div className="my-4">
        <h2 className="text-xl font-bold my-4">Existing Samples</h2>
        <div className="flex flex-wrap gap-3 justify-evenly">
          {(data as Packs[]).map((pack) => (
            <Pack key={pack.id} {...pack} />
          ))}
        </div>
      </div>
    </>
  );
};

export default page;
