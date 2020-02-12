import * as Yup from "yup";

const BlogYup = () => {
  return Yup.object().shape({
    id: Yup.number(),
    authorId: Yup.number(),
    blogTypeId: Yup.number().required("Required"),
    name: Yup.string(),
    title: Yup.string()
      .required("Required")
      .min(2, "Too Short!")
      .max(50, "Too Long!"),
    subject: Yup.string()
      .required("Required")
      .min(2, "Too Short!")
      .max(120, "Too Long!"),
    content: Yup.string().min(40, "Too Short!"),
    isPublished: Yup.bool().required("Required"),
    datePublish: Yup.date().required("Required"),
    imageUrl: Yup.string()
      .url()
      .min(2, "Too Short!")
      .max(225, "Too Long!")
  });
};

export default BlogYup;
