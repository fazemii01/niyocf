import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getTestimonialById,
  updateTestimonialEntry,
} from "../../utils/dataProvider/testimonial";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const controller = useMemo(() => new AbortController(), []);
  const [form, setForm] = useState({ name: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTestimonialById(id, controller);
        setForm(res.data.data);
      } catch (err) {
        toast.error(err.message);
        navigate("/testimonial");
      }
    };
    fetchData();
  }, [id, navigate, controller]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await updateTestimonialEntry(id, form, token, controller);
      toast.success("Testimonial updated");
      navigate("/testimonial");
    } catch (err) {
      toast.error(err.message || "Failed to update testimonial");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Testimonial</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <textarea
        name="text"
        placeholder="Testimonial"
        value={form.text}
        onChange={handleChange}
        className="textarea textarea-bordered w-full"
        required
      />
      <button type="submit" className="btn btn-primary text-white">
        Save
      </button>
    </form>
  );
};

export default EditTestimonial;
