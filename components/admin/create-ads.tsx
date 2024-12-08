"use client";
import { createAds } from "@/app/actions/db";
import { createAdsSchema } from "@/lib/definations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ImagePlus, Link as LinkIcon, Loader2 } from "lucide-react";
import Image from "next/image";

const CreateAds = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAdsSchema),
    defaultValues: {
      image: null as File | null,
      adUrl: "",
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
    console.log(data);
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("adUrl", data.adUrl);
      const result = await createAds(formData);
      console.log("res", result);
    } catch (error) {
      console.error("Error creating ad:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-black rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Ad
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ad Image
          </label>
          <div className="relative">
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
        </div>

        {/* Ad URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Advertisement URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("adUrl")}
              type="url"
              placeholder="https://example.com"
              className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.adUrl ? "border-red-300" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          {errors.adUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.adUrl.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent 
            rounded-lg shadow-sm text-sm font-medium text-white 
            ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
            transition-colors duration-200`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Creating Ad...
            </>
          ) : (
            "Create Advertisement"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAds;
