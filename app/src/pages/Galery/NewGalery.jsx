import React, { useState, useEffect, useMemo } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import productPlaceholder from "../../assets/images/placeholder-promo.jpg";
import { createGalleryEntry } from "../../utils/dataProvider/gallery";

const NewGallery = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const navigate = useNavigate();

  const initialFormState = {
    image: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [preview, setPreview] = useState("");
  const [cancel, setCancel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const controller = useMemo(() => new AbortController(), []);

  useEffect(() => {
    if (!form.image) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(form.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  const handleFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) return toast.error("Image max 2MB");

    setForm({ ...form, image: file });
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
    if (!form.image || !form.description || !form.date) {
      return toast.error("All fields required");
    }

    setLoading(true);

    try {
      const token = userInfo?.token || localStorage.getItem("token");
      await createGalleryEntry(
        {
          image: form.image,
          description: form.description,
          date: form.date,
        },
        token,
        controller
      );

      toast.success("Gallery item added");
      navigate("/"); // ✅ Redirect to homepage
    } catch (err) {
      toast.error(err.message || "Failed to upload gallery item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={cancel} onClose={() => setCancel(false)}>
        <p>Reset the form?</p>
        <div className="flex gap-4 mt-4">
          <button
            className="btn btn-error"
            onClick={() => {
              setForm({ ...initialFormState });
              setCancel(false);
              setPreview("");
            }}
          >
            Yes
          </button>
          <button className="btn" onClick={() => setCancel(false)}>
            No
          </button>
        </div>
      </Modal>

      <Header />
      <main className="global-px py-6">
        <section className="flex flex-col md:flex-row gap-12 py-8">
          <section className="flex-1 flex flex-col items-center gap-4">
            <nav className="flex flex-row list-none gap-1">
              <li className="after:content-['>'] after:font-poppins font-semibold text-primary">
                <NavLink to="/Gallerys">Gallerys</NavLink>
              </li>
              <li className="text-tertiary font-poppins font-semibold">
                Add new gallerys
              </li>
            </nav>
            <div className="avatar">
              <div className="w-52 rounded-2xl border">
                <img
                  src={preview || productPlaceholder}
                  className="object-cover"
                  alt="preview"
                />
              </div>
            </div>
            <label htmlFor="form_image" className="btn btn-accent text-white">
              Choose Image
            </label>
            <input
              id="form_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </section>

          <form
            onSubmit={handleSubmit}
            className="flex-[2_2_0%] md:pl-12 lg:pl-24 flex flex-col gap-4"
          >
            <label className="text-tertiary font-bold text-lg">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
              rows={4}
            />

            <label className="text-tertiary font-bold text-lg">Date</label>
            <Datepicker
              value={{ startDate: form.startDate, endDate: form.endDate }}
              onChange={handleDateChange}
              displayFormat={"YYYY-MM-DD"}
              asSingle
              useRange={false}
              inputClassName="w-full border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
              popoverDirection="down"
            />

            <button
              type="submit"
              className={`${
                isLoading && "loading"
              } btn btn-lg btn-primary text-white mt-4`}
            >
              Save Gallery
            </button>
            <button
              type="reset"
              onClick={() => setCancel(true)}
              className="btn btn-lg bg-gray-200 text-black"
            >
              Reset
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NewGallery;
