import Swal from "sweetalert2";

// Success
export const showSuccess = (text = "Done successfully") => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text,
    confirmButtonColor: "#28a745",
  });
};

// Warning! 
export const showConfirm = async (text = "Are you sure?") => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });

  return result.isConfirmed;
};

// Error
export const showError = (text = "Something went wrong") => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text,
  });
};

// Loading
export const showLoading = (text = "Loading...") => {
  Swal.fire({
    title: text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => {
  Swal.close();
};
