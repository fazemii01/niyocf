import React, { useState } from "react";

import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteGalleryEntry } from "../../utils/dataProvider/gallery";
import Modal from "../Modal";

function DeleteGallery({ isOpen, onClose, galleryId, userInfo }) {
  const [isLoading, setIsLoading] = useState(false);
  const controller = new AbortController();
  const navigate = useNavigate();

  const yesHandler = () => {
    if (isLoading) return;
    setIsLoading(true);
    deleteGalleryEntry(galleryId, userInfo.token, controller)
      .then(() => {
        navigate("/gallery", { replace: true });
        toast.success("Gallery item deleted successfully");
      })
      .catch(() => {
        toast.error("An error occurred");
      })
      .finally(() => setIsLoading(false));
  };

  const closeHandler = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <p>
        Are you sure you want to delete this gallery? This action can&apos;t be
        undone!
      </p>

      <p>Warning: this act can&apos;t be undone!</p>

      <section className="flex justify-center items-center mt-5 gap-5">
        <button
          className={`${isLoading && "loading"} btn btn-error px-10`}
          onClick={yesHandler}
        >
          Yes
        </button>
        <button
          disabled={isLoading}
          className={`${isLoading && "btn-disabled"} btn px-10`}
          onClick={closeHandler}
        >
          No
        </button>
      </section>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProps)(DeleteGallery);
