import axios from "axios";
import { clientEnv } from "@/config/env";

interface ImgBBResponse {
  data: {
    display_url: string;
  };
}

const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${clientEnv.NEXT_PUBLIC_IMG_HOSTING_KEY}`;

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post<ImgBBResponse>(imageUploadUrl, formData);
  return data.data.display_url;
};
