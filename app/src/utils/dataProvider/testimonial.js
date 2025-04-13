import api from "./base";

export const getAllTestimonials = (controller) =>
  api.get("/apiv1/testimonials", { signal: controller.signal });

export const getTestimonialById = (id, controller) =>
  api.get(`/apiv1/testimonials/${id}`, { signal: controller.signal });

export const createTestimonialEntry = (data, token, controller) =>
  api.post("/apiv1/testimonials", data, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });

export const updateTestimonialEntry = (id, data, token, controller) =>
  api.patch(`/apiv1/testimonials/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });

export const deleteTestimonialEntry = (id, token, controller) =>
  api.delete(`/apiv1/testimonials/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  });