// 📁 src/utils/dataProvider/gallery.js

import api from "./base"; // this should be your configured Axios instance

export const createGalleryEntry = (
  { image = "", description = "", date = "" },
  token,
  controller
) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("description", description);
  formData.append("date", date);

  return api.post("/apiv1/gallery", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    signal: controller.signal,
  });
};

export const getAllGallery = (controller) => {
  return api.get("/apiv1/gallery", {
    signal: controller.signal,
  });
};

export const updateGalleryEntry = async (id, payload, token, controller) => {
  const galleryId = typeof id === "object" ? id.id : id;
  const formData = new FormData();

  if (payload.image) formData.append("image", payload.image);
  formData.append("description", payload.description);
  formData.append("date", payload.date);

  const res = await fetch(
    `${process.env.REACT_APP_BACKEND_HOST}/apiv1/gallery/${galleryId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller?.signal,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update gallery");
  }

  return res.json();
};

export const deleteGalleryEntry = (id, token, controller) => {
  return api.delete(`/apiv1/gallery/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller.signal,
  });
};
