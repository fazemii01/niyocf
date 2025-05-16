import React, { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import productPlaceholder from "../../assets/images/placeholder-promo.jpg";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import DeleteGallery from "../../components/Gallery/DeleteGallery";
import {
  getAllGallery,
  updateGalleryEntry,
} from "../../utils/dataProvider/gallery";

const EditGallery = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const controller = React.useMemo(() => new AbortController(), []);

  const [form, setForm] = useState({
    image: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [cancel, setCancel] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    getAllGallery(controller)
      .then((res) => {
        const item = res.data.data.find((i) => String(i.id) === String(id));
        if (!item) throw new Error("Gallery item not found");
        const formattedDate = new Date(item.date).toISOString().split("T")[0];
        setForm({
          image: "",
          description: item.description || "",
          startDate: formattedDate,
          endDate: formattedDate,
          date: formattedDate,
        });
        setData({
          image: "",
          description: item.description || "",
          startDate: formattedDate,
          endDate: formattedDate,
          date: formattedDate,
        });
        setPreview(item.image || productPlaceholder);
        setIsLoading(false);
      })
      .catch((err) => {
        setNotFound(true);
        setIsLoading(false);
        toast.error(err.message);
      });
  }, [id]);

  useEffect(() => {
    if (!form.image) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(form.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setForm({ ...form, image: "" });
      return;
    }
    if (e.target.files[0].size > 2 * 1024 * 1024) {
      return toast.error("Files must not exceed 2 MB");
    }
    setForm({ ...form, image: e.target.files[0] });
  };

  const formChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!form.description || !form.date) {
      return toast.error("Input required form");
    }
    setLoading(true);
    updateGalleryEntry(
      id,
      {
        image: form.image,
        description: form.description,
        date: form.date,
      },
      props.userInfo.token,
      controller
    )
      .then(() => {
        navigate("/", { replace: true });
        toast.success("Gallery updated successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  };

  const resetHandler = () => {
    setForm({ ...data });
    setCancel(false);
  };

  const disabled = isEqual(form, data);

  return (
    <>
      <Modal isOpen={cancel} onClose={() => setCancel(!cancel)}>
        <p>Are you sure want to reset the form?</p>
        <section className="flex justify-center gap-x-5 mt-5">
          <button className="btn btn-error" onClick={resetHandler}>
            Yes
          </button>
          <button className="btn" onClick={() => setCancel(!cancel)}>
            No
          </button>
        </section>
      </Modal>
      <DeleteGallery
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        galleryId={id}
      />
      <Header />
      {isLoading ? (
        <Loading />
      ) : notFound ? (
        <main className="text-center py-10">
          <p>Gallery Not Found</p>
        </main>
      ) : (
        <main className="global-px py-6">
          <nav className="flex flex-row list-none gap-1">
            <li className="after:content-['>'] after:font-poppins font-semibold text-primary">
              <NavLink to="/gallery">Gallery</NavLink>
            </li>
            <li className="text-tertiary font-poppins font-semibold">
              Edit Gallery
            </li>
          </nav>
          <section className="flex flex-col md:flex-row py-14">
            <section className="flex-1 flex flex-col items-center gap-4">
              <div className="avatar">
                <div className="w-52 rounded-full">
                  <img src={preview || productPlaceholder} alt="Preview" />
                </div>
              </div>
              <label
                htmlFor="form_image"
                className="btn btn-block btn-lg normal-case mt-2 btn-accent text-white"
              >
                Take a picture
              </label>
              <label
                htmlFor="form_image"
                className="btn btn-block btn-lg normal-case btn-secondary text-tertiary"
              >
                Choose from gallery
              </label>
              <button
                onClick={() => setDeleteModal(true)}
                className="btn btn-block btn-error btn-lg normal-case btn-secondary"
              >
                Delete Gallery
              </button>
            </section>
            <form
              onSubmit={submitHandler}
              className="flex-[2_2_0%] md:pl-12 lg:pl-24 flex flex-col gap-4"
            >
              <input
                id="form_image"
                type="file"
                accept="image/png, image/webp, image/jpeg"
                className="hidden"
                required
                onChange={onSelectFile}
              />
              <label className="text-tertiary font-bold text-lg" htmlFor="desc">
                Description :
              </label>
              <textarea
                name="description"
                id="desc"
                value={form.description}
                onChange={formChangeHandler}
                placeholder="Describe your gallery item"
                rows={4}
                className="border-b-2 py-2 border-gray-300 focus:border-tertiary outline-none"
                required
              ></textarea>
              <label className="text-tertiary font-bold text-lg" htmlFor="date">
                Date :
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={form.date}
                onChange={formChangeHandler}
                className="input input-bordered"
                required
              />
              <button
                type="submit"
                onClick={submitHandler}
                disabled={disabled}
                className={`${loading && "loading"} ${
                  disabled && "btn-disabled"
                } btn btn-block btn-lg normal-case mt-2 btn-primary text-white shadow-lg rounded-2xl disabled:text-gray-400`}
              >
                Save Changes
              </button>
              <button
                type="reset"
                onClick={() => setCancel(true)}
                disabled={disabled || loading}
                className={`${
                  (disabled || loading) && "btn-disabled"
                } btn btn-lg normal-case bg-gray-200 hover:bg-gray-300 border-gray-300 text-tertiary shadow-lg rounded-2xl disabled:text-gray-400`}
              >
                Reset changes
              </button>
            </form>
          </section>
        </main>
      )}
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProps)(EditGallery);
