import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BackendService from "../../service/BackendService";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { notificationSliceActions } from "../../service/NotificationSlice";

// Styled component for image preview
const ImagePreview = styled("div")(({ theme }) => ({
  position: "relative",
  width: "220px",
  height: "220px",
  border: "1px solid #ccc",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  borderRadius: "8px",
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

// Validation schema with Yup
const CourseSchema = Yup.object().shape({
  name: Yup.string().required("Course name is required"),
  images: Yup.string().required("Image is required"),
});

function CreateOrEditCourse({
  open,
  setOpen,
  selectedCourse,
  getCourses,
  setSelectedCourse,
}) {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.cognito.user);
  const { courseId } = useParams();

  const handleClose = () => {
    setOpen(false);
    setImages([]);
    setSelectedCourse(null);
  };


  // Single image upload
  const handleImageUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!file) return;
    const newImage = { file, url: URL.createObjectURL(file) };
    setImages([newImage]);
    setFieldValue("images", file?.name);
  };

  const handleImageDelete = (setFieldValue) => {
    setImages([]);
    setFieldValue("images", "");
  };

  // Drag & Drop
  const handleDrop = (event, setFieldValue) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const newImage = { file, url: URL.createObjectURL(file) };
    setImages([newImage]);
    setFieldValue("images", file?.name);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const submitCourse = (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("file", images[0].file);
    formData.append("authorId", user?.sub);
    setLoading(true);
    BackendService.createCourse(formData)
      .then(() => {
        setLoading(false);
        setLoading(false);
        getCourses();
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "success",
            message: "Course added successfully",
          })
        );
        handleClose();
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: "Failed to add course",
          })
        );
      });
  };

  const editCourse = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    images[0].file && formData.append("file", images[0].file);
    formData.append("authorId", user?.sub);
    // formData.append("authorId", "kshkvhaskhk");

    setLoading(true);
    BackendService?.updateCourse(formData, selectedCourse?.id)
      .then(() => {
        setLoading(false);
        setLoading(false);
        getCourses();
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "success",
            message: "Course edited successfully",
          })
        );
        handleClose();
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          notificationSliceActions.setNotification({
            open: true,
            severity: "error",
            message: "Failed to edit course",
          })
        );
      });
  };

  useEffect(() => {
    if (selectedCourse) {
      setImages(selectedCourse?.photoKey);
    }
  }, [selectedCourse, open]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Backdrop  sx={{
      position: 'absolute',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      color: '#3B9261',
    }}open={loading}>
          <CircularProgress color="#3B9261" />
        </Backdrop>
        <DialogTitle>
          {selectedCourse ? "Edit Course" : "Create Course"}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Formik
          initialValues={{
            name: selectedCourse?.name || "",
            description: selectedCourse?.description || "",
            images: selectedCourse?.photoKey || '',
          }}
          validationSchema={CourseSchema}
          onSubmit={selectedCourse ? editCourse : submitCourse}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <DialogContent dividers>
                <TextField
                  name="name"
                  label={
                    <>
                      Course Name <span className="error">*</span>
                    </>
                  }
                  fullWidth
                  margin="normal"
                  value={values.name}
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': { color: '#3B9261' },
                    },
                  }}
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        borderBottom: '1px solid #ddd !important',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        borderBottom: '1px solid #ccc !important',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        borderBottom: '2px solid #3B9261 !important',
                      },
                    },
                  }}
                />
                {errors.name && (
                  <Typography color="error" variant="body2">
                    {errors.name}
                  </Typography>
                )}

                <TextField
                  name="description"
                  label={
                    <>
                      Description 
                    </>
                  }
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={values.description}
                  onChange={handleChange}
                  InputLabelProps={{
                    sx: {
                      '&.Mui-focused': { color: '#3B9261' },
                    },
                  }}
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        borderBottom: '1px solid #ddd !important',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        borderBottom: '1px solid #ccc !important',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important',
                        borderBottom: '2px solid #3B9261 !important',
                      },
                    },
                  }}
                />

                <Stack
                  direction="row"
                  spacing={2}
                  mt={2}
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  {images.length > 0 ? (
                    <ImagePreview>
                      <img src={images[0].url || images} alt="Preview" />
                      <IconButton
                        size="small"
                        onClick={() => handleImageDelete(setFieldValue)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <DeleteIcon
                          style={{ color: "#b30909" }}
                          fontSize="small"
                        />
                      </IconButton>
                    </ImagePreview>
                  ) : (
                    <div
                      onDrop={(e) => handleDrop(e, setFieldValue)}
                      onDragOver={handleDragOver}
                      style={{
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        textAlign: "center",
                        minHeight: "110px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                      onClick={() =>
                        document.getElementById("imageUpload").click()
                      }
                    >
                      <Typography variant="body1">
                        Drag and drop image here or click to upload{" "}
                        <span className="error">*</span>
                      </Typography>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, setFieldValue)}
                      />
                    </div>
                  )}
                </Stack>
                {errors.images && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.images}
                  </Typography>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} className="secondaryBtnAdmin">
                  Cancel
                </Button>
                <Button className="pimaryBtnAdmin" type="submit" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default CreateOrEditCourse;
