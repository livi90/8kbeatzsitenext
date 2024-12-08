"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBeatSchema } from "@/lib/definations";
import { createBeat } from "@/app/actions/db";
import { Plus, Music, Hash, Link2, ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

const CreateBeat = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBeatSchema),
    defaultValues: {
      name: "",
      genere: "",
      bpm: "",
      downloadUrl: "",
      image: null as File | null,
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === "image") {
        formData.append(key, value as Blob);
        continue;
      }
      formData.append(key, value as string);
    }

    const result = await createBeat(formData);
    console.log("res", result);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
        Add New Beat
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="relative col-span-2">
            <input
              {...register("image")}
              type="file"
              id="image-upload"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
            <label
              htmlFor="image-upload"
              className={`relative cursor-pointer flex items-center justify-center border-2 border-dashed rounded-lg p-6 
                ${
                  errors.image
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } 
                hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200`}
            >
              {preview ? (
                <div className="relative w-full aspect-video">
                  <Image
                    fill
                    src={preview}
                    alt="Preview"
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                    <p className="text-white text-sm">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </label>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-gray-200"
            >
              <Music className="w-4 h-4" />
              Beat Name
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400"
              placeholder="Enter beat name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="genere"
              className="flex items-center gap-2 text-sm font-medium text-gray-200"
            >
              <Music className="w-4 h-4" />
              Genre
            </label>
            <input
              {...register("genere")}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400"
              placeholder="Enter genre"
            />
            {errors.genere && (
              <p className="text-red-500 text-sm mt-1">
                {errors.genere.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bpm"
              className="flex items-center gap-2 text-sm font-medium text-gray-200"
            >
              <Hash className="w-4 h-4" />
              BPM
            </label>
            <input
              {...register("bpm", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400"
              placeholder="Enter BPM"
            />
            {errors.bpm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bpm.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="downloadUrl"
              className="flex items-center gap-2 text-sm font-medium text-gray-200"
            >
              <Link2 className="w-4 h-4" />
              Download Link
            </label>
            <input
              {...register("downloadUrl")}
              type="text"
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                text-white placeholder-gray-400"
              placeholder="Enter download URL"
            />
            {errors.downloadUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.downloadUrl.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <Button
          disabled={isSubmitting}
          type="submit"
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 
            rounded-md transition-colors duration-200 flex items-center justify-center 
            gap-2 mt-8 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Plus className="w-5 h-5" />
          {isSubmitting ? "Adding Beat..." : "Add Beat"}
        </Button>
      </form>
    </div>
  );
};

export default CreateBeat;
