// services/noteService.js

import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export const createNote = async (data) => {
  const [request, isLoading] = useApi({
    url: "/api/v1/notes",
    method: "POST",
  });

  const { auth } = useAuth(); // Assuming you have the authentication data available
  const { accessToken } = auth;

  try {
    const { response, result } = await request({
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Note created successfully!");
      return result; // Optionally, return the created note data
    } else {
      toast.error(result?.message || "Failed to create note");
      throw new Error(result?.message || "Failed to create note");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
    throw error;
  }
};
