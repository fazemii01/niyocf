import api from "./base";

export const getAllTestimonials = (controller) =>
  api.get("/apiv1/testimonial", { signal: controller.signal });

export const getTestimonialById = (id, controller) =>
  api.get(`/apiv1/testimonial/${id}`, { signal: controller.signal });

export const createTestimonialEntry = (data, token, controller) =>
  api.post("/apiv1/testimonial", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type manually, let browser handle multipart/form-data
    },
    signal: controller.signal,
  });

export const updateTestimonialEntry = (id, data, token, controller) =>
  api.patch(`/apiv1/testimonial/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });

export const deleteTestimonialEntry = (id, token, controller) =>
  api.delete(`/apiv1/testimonial/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });
