"use client";

import { createPack } from "@/app/actions/db";
import { createPackSchema } from "@/lib/definations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

const CreatePack = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPackSchema),
    defaultValues: {
      name: "",
      description: "",
      downloadUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    const result = await createPack(formData);
    console.log("res", result);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
        Add New Sample Pack
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-200"
            >
              Sample Pack Name
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400"
              placeholder="Enter pack name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message?.toString()}</p>
            )}
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-200"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400 resize-none"
              placeholder="Enter pack description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message?.toString()}</p>
            )}
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="downloadUrl" 
              className="block text-sm font-medium text-gray-200"
            >
              Download Link
            </label>
            <input
              {...register("downloadUrl")}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400"
              placeholder="Enter download URL"
            />
            {errors.downloadUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.downloadUrl.message?.toString()}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 
            rounded-md transition-colors duration-200 flex items-center justify-center 
            gap-2 mt-8"
        >
          <Plus className="w-5 h-5" />
          Add Sample Pack
        </Button>
      </form>
    </div>
  );
};

export default CreatePack;
