import React, { useState } from "react";

import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteTestimonialEntry } from "../../utils/dataProvider/testimonial";
import Modal from "../Modal";

function DeleteTestimonial({
  isOpen,
  onClose,
  testimonialId,
  testimonialName, // Added for a more specific message
  userInfo,
  onSuccess, // Callback for successful deletion
}) {
  const [isLoading, setIsLoading] = useState(false);
  const controller = React.useMemo(() => new AbortController(), []);
  const navigate = useNavigate();

  const yesHandler = () => {
    if (isLoading) return;
    setIsLoading(true);
    deleteTestimonialEntry(testimonialId, userInfo.token, controller)
      .then(() => {
        toast.success(
          `Testimonial "${testimonialName || "item"}" deleted successfully`
        );
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Error deleting testimonial:", error);
      })
      .finally(() => {
        setIsLoading(false);
        navigate("/", { replace: true });
        onClose();
      });
  };

  const closeHandler = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler}>
      <div className="text-center p-4">
        <p className="text-xl font-semibold mb-4">Confirm Deletion</p>
        <p className="mb-6">
          Are you sure you want to delete the testimonial
          {testimonialName ? ` "${testimonialName}"` : ""}?
          <br />
          This action cannot be undone.
        </p>

        <section className="flex justify-center items-center mt-5 gap-5">
          <button
            className={`btn btn-error px-10 ${
              isLoading ? "loading btn-disabled" : ""
            }`}
            onClick={yesHandler}
            disabled={isLoading}
          >
            Yes, Delete
          </button>
          <button
            disabled={isLoading}
            className={`btn px-10 ${isLoading ? "btn-disabled" : ""}`}
            onClick={closeHandler}
          >
            No, Cancel
          </button>
        </section>
      </div>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
});

export default connect(mapStateToProps)(DeleteTestimonial);
