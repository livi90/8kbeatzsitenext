"use server";

import {
  createAdsSchema,
  createBeatSchema,
  createPackSchema,
} from "@/lib/definations";
import { Database } from "@/lib/schema";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

type Beats = Database["public"]["Tables"]["beats"]["Row"];
type Packs = Database["public"]["Tables"]["packs"]["Row"];

export const createBeat = async (formData: FormData) => {
  const validateFields = createBeatSchema.safeParse({
    name: formData.get("name"),
    genere: formData.get("genere"),
    bpm: Number(formData.get("bpm")),
    downloadUrl: formData.get("downloadUrl"),
    image: formData.get("image"),
  });

  if (!validateFields.success) return { error: "bad request" };

  const { name, genere, bpm, downloadUrl, image } = validateFields.data;
  console.log("1");
  const supabase = await createClient();
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(`folder/${uuidv4()}`, image);

  console.log("uper", uploadError);
  if (uploadError) {
    return { error: uploadError.message };
  }

  // Generate a public URL for the uploaded image
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  if (!publicUrlData) {
    return { error: "Failed to generate public URL" };
  }
  const { data, error } = await supabase.from("beats").insert({
    name,
    genere,
    bpm,
    download_url: downloadUrl,
    image_url: publicUrlData.publicUrl,
  });

  if (error) return { error };
  revalidatePath("/admin/beats");

  return {
    data: {
      messege: "success",
    },
  };
};

export const getBeats = async (): Promise<{
  data?: Beat[];
  error?: string;
}> => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const { data, error } = await supabase
    .from("beats")
    .select(
      userId
        ? "id, created_at, name, genere, download_url, image_url, bpm"
        : "id, created_at, name, genere, image_url, bpm"
    )
    .returns<Beat[]>();

  if (error) {
    return { error: error.message };
  }

  return { data };
};
export async function deleteBeat(beatId: number) {
  if (!beatId) return { error: "bad request" };

  // Perform the delete action
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("beats")
    .delete()
    .eq("id", beatId);

  if (error) {
    console.error("Error deleting beat:", error);
    return { error: "something went wrong" };
  }
  revalidatePath("/admin/beats");
  return { messege: "success" };
}

export const createPack = async (formData: FormData) => {
  const validatedFields = createPackSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    downloadUrl: formData.get("downloadUrl"),
  });

  if (!validatedFields.success) return { error: "bad request" };

  const { name, description, downloadUrl } = validatedFields.data;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packs")
    .insert({ name, description, download_url: downloadUrl });

  if (error) return { error: error.message };
  revalidatePath("/admin/samples");

  return {
    data: {
      messege: "success",
    },
  };
};
export const getPacks = async (): Promise<{
  data?: Packs[];
  error?: string;
}> => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  const { data, error } = await supabase
    .from("packs")
    .select(
      userId
        ? "id, created_at, name, description, download_url, downloads"
        : "id, created_at, name, description, downloads"
    )
    .returns<Packs[]>();

  if (error) {
    return { error: error.message };
  }

  return { data };
};
export async function deletePack(packId: number) {
  if (!packId) return { error: "bad request" };

  // Perform the delete action
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("packs")
    .delete()
    .eq("id", packId);

  if (error) {
    console.error("Error deleting pack:", error);
    return { error: "something went wrong" };
  }
  revalidatePath("/admin/samples");
  return { messege: "success" };
}
export async function createAds(formData: FormData) {
  // Validate fields using Zod schema
  const validatedFields = createAdsSchema.safeParse({
    image: formData.get("image"),
    adUrl: formData.get("adUrl"),
  });

  if (!validatedFields.success) return { error: "bad request" };

  const { image, adUrl } = validatedFields.data;
  // Initialize Supabase client
  const supabase = await createAdminClient();

  // Upload image to Supabase storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(`folder/${uuidv4()}`, image);

  if (uploadError) {
    return { error: uploadError.message };
  }

  // Generate a public URL for the uploaded image
  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);

  if (!publicUrlData) {
    return { error: "Failed to generate public URL" };
  }

  // Insert ad record into 'ads' table with the image URL
  const { data, error: insertError } = await supabase
    .from("ads")
    .insert({ image_url: publicUrlData.publicUrl, ad_link: adUrl });

  if (insertError) return { error: insertError.message };
  revalidatePath("/admin/ads");
  return { data };
}
export async function deleteAds(adId: number) {
  if (!adId) return { error: "bad request" };

  // Perform the delete action
  const supabase = await createAdminClient();
  const { data: searchData, error: searchError } = await supabase
    .from("ads")
    .select("image_url")
    .eq("id", adId)
    .single();
  if (searchError || !searchData) return { error: "something went wrong" };
  const imageUrl = searchData.image_url as string;
  console.log("iurl", imageUrl);
  if (imageUrl) {
    // Extract the storage path from the public URL if necessary
    // For example, if the URL is something like "https://xyz.supabase.co/storage/v1/object/public/images/my-image.jpg"
    // You might need to extract "images/my-image.jpg" to delete the file from storage

    const imagePath = imageUrl.replace(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`,
      ""
    );
    console.log("pa", imagePath);
    // Now delete the image from Supabase storage
    const { error: deleteImageError } = await supabase.storage
      .from("images") // Replace with your bucket name
      .remove([imagePath]);

    if (deleteImageError) {
      console.error("Error deleting image:", deleteImageError);
      return { error: "failed to delete image" };
    }
  }
  const { data, error } = await supabase.from("ads").delete().eq("id", adId);

  if (error) {
    console.error("Error deleting ad:", error);
    return { error: "something went wrong" };
  }

  return { messege: "success" };
}
export async function uploadImage(file: File) {
  if (!file) throw new Error("No file provided");
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("images")
    .upload(`uploads/${Date.now()}_${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    return { error: error.message };
  }
  // revalidatePath("/admin/ads");
  return { data };
}

export async function countAllUsers() {
  const supabase = await createAdminClient();
  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  return users.length || 0;
}
