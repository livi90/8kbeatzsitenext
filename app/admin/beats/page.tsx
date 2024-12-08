import { getBeats } from "@/app/actions/db";
import CreateBeat from "@/components/admin/create-beat";
import Beat from "@/components/beat";
import { Database } from "@/lib/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
// export const dynamic = 'force-dynamic'
type Beats = Database["public"]["Tables"]["beats"]["Row"];
const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {

 const {data, error} = await getBeats()

  if (error) return <div>something went wrong</div>;
  return (
    <>
      <CreateBeat />
      <div className="my-4">
        <h2 className="text-xl font-bold my-4">Existing Beat</h2>
        <div className="flex flex-wrap gap-3 justify-evenly">
          {(data as Beats[]).map((beat) => (
            <Beat key={beat.id} {...beat} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
