import React from "react";
import { getPacks } from "../actions/db";
import Beat from "@/components/beat";
import Pack from "@/components/pack";

const page = async () => {
  const { data: packs, error } = await getPacks();

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
          Here are your free sample packs
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse through our collection of free packs.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {packs?.map((pack) => (
          <div
            key={pack.id}
            className="transform hover:-translate-y-1 transition-transform duration-300"
          >
            <Pack {...pack}/>
          </div>
        ))}
      </div>

      {packs?.length === 0 && (
        <div className="flex items-center justify-center min-h-[200px] text-gray-500">
          <p className="text-lg">No beats available at the moment.</p>
        </div>
      )}
    </main>
  );
};

export default page;
