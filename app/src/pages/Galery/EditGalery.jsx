import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Datepicker from "react-tailwindcss-datepicker";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import productPlaceholder from "../../assets/images/placeholder-promo.jpg";
import {
  getAllGallery,
  updateGalleryEntry,
} from "../../utils/dataProvider/gallery";

const EditGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const controller = useMemo(() => new AbortController(), []);

  const [form, setForm] = useState({
    image: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getAllGallery(controller);
        const item = res.data.data.find(
          (item) => String(item.id) === String(id)
        );
        if (!item) throw new Error("Gallery item not found");

        const formattedDate = new Date(item.date).toISOString().split("T")[0];

        setForm({
          image: "",
          description: item.description || "",
          startDate: formattedDate,
          endDate: formattedDate,
          date: item.date || "",
        });

        setPreview(item.image || productPlaceholder);
      } catch (err) {
        toast.error(err.message || "Failed to load gallery");
        navigate("/gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id, navigate, controller]);

  const handleFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) return toast.error("Image max 2MB");
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (val) => {
    setForm({
      ...form,
      startDate: val.startDate,
      endDate: val.endDate,
      date: val.startDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await updateGalleryEntry(
        id,
        {
          image: form.image,
          description: form.description,
          date: form.startDate,
        },
        token,
        controller
      );

      toast.success("Gallery item updated");
      navigate("/gallery");
    } catch (err) {
      toast.error(err.message || "Failed to update gallery");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="text-center py-10">
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Edit Gallery</h1>

        <div className="card bg-base-100 shadow-xl rounded-xl overflow-hidden">
          <figure className="w-full h-60 overflow-hidden">
            <img
              src={preview || productPlaceholder}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </figure>

          <form onSubmit={handleSubmit} className="card-body space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="file-input file-input-bordered w-full"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              rows={3}
              required
            />

            <Datepicker
              value={{ startDate: form.startDate, endDate: form.endDate }}
              onChange={handleDateChange}
              asSingle
              useRange={false}
              showShortcuts
              inputClassName="input input-bordered w-full"
            />

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/gallery")}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-white">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditGallery;
