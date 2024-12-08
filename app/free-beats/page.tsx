import React from "react";
import { getBeats } from "../actions/db";
import Beat from "@/components/beat";

const page = async () => {
  const { data: beats, error } = await getBeats();

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold">Something went wrong!</h2>
        </div>
      </div>
    );

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Check free beats of all generes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          To be able to download you must be registered, after downloading you must read terms and conditions of every beat.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {beats?.map((beat) => (
          <div
            key={beat.id}
            className="transform hover:-translate-y-1 transition-transform duration-300"
          >
            <Beat {...beat} />
          </div>
        ))}
      </div>

      {beats?.length === 0 && (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500">
          <p className="text-lg">No beats available at the moment.</p>
        </div>
      )}
    </main>
  );
};

export default page;
