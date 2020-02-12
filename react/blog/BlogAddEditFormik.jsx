import React from "react";
import swal from "sweetalert";
import BlogYup from "./BlogYup";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import FileUpload from "../files/FileUpload";
import { Formik, Field, Form } from "formik";
import { FormGroup, Label, Card } from "reactstrap";
import BlogCKEditor from "./addEditComponents/BlogCKEditor";
import * as BlogServices from "../../services/blogService";
import EditorPreview from "./addEditComponents/EditorPreview";

const _logger = debug.extend("Blog Add Edit Formik Page");

class BlogAddEditFormik extends React.Component {
  state = {
    heading: "Create",
    types: [],
    mappedTypes: [],
    urlList: "",
    formData: {
      id: "",
      authorId: "",
      blogTypeId: "",
      name: "",
      title: "",
      content: "",
      subject: "",
      isPublished: false,
      datePublish: "",
      imageUrl:
        "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png"
    },
  };

  componentDidMount() {
    this.stateFiller();
    this.populateDropDown();
    _logger(
      `componentDidMount: this.state.formData --> ${this.state.formData}`
    );
  }

  populateDropDown = () => {
    BlogServices
      .getBlogTypes()
      .then(this.onGetBlogTypesSuccess)
      .catch(this.onGetBlogTypesError);
  };

  onGetBlogTypesSuccess = response => {
    let _types = response.item;
    this.setState(() => {
      return {
        types: _types,
        mappedTypes: _types.map(this.mapTypes)
      };
    });
  };

  onGetBlogTypesError = error => {
    _logger(error);
    toast("Could not retrieve form data.");
  };


  handleClickToState = content => {
    this.setState(() => {
      return { content: content };
    });
    _logger(
      `handleClickToState: this.state.content --> ${this.state.formData.content}`
    );
  };

  stateFiller = () => {
    if (this.props.history.location.state) {
      this.setState(() => {
        return {
          heading: "Edit",
          formData: {
            id: this.props.history.location.state.id,
            authorId: this.props.history.location.state.authorId,
            blogTypeId: this.props.history.location.state.blogTypeId,
            name: this.props.history.location.state.name,
            title: this.props.history.location.state.title,
            subject: this.props.history.location.state.subject,
            content: this.props.history.location.state.content,
            isPublished: this.props.history.location.state.isPublished,
            datePublish: this.props.history.location.state.datePublish,
            imageUrl: this.props.history.location.state.imageUrl
          }
        };
      });
    }
  };

  addEditEnableReinitialize = () => {
    if (this.props.history.location.state) {
      return true
    }
    else {
      return false
    }
  }

  onAdd = formValues => {
    const blog = {
      id: formValues.id,
      authorId: formValues.authorId,
      blogTypeId: formValues.blogTypeId,
      name: formValues.name,
      title: formValues.title,
      subject: formValues.subject,
      content: formValues.content,
      isPublished: formValues.isPublished,
      datePublish: formValues.datePublish,
      imageUrl: this.state.formData.imageUrl
    };
    if (formValues.id.length === 0) {
      BlogServices.createBlog(blog)
        .then(this.onSaveBlogSuccess)
        .catch(this.onSaveBlogError);
    } else {
      BlogServices.updateBlog(blog.id, blog)
        .then(this.onSaveBlogSuccess)
        .catch(this.onSaveBlogError);
    }
  };

  onSaveBlogSuccess = () => {
    swal({
      title: "Success!",
      text: "Blog Saved",
      icon: "success"
    });
    this.props.history.push("/blogs");
  };
  onSaveBlogError = () => {
    swal("blog did not save");
  };

  mapTypes = state => (
    <option key={state.blogTypeId} value={state.blogTypeId}>
      {state.name}
    </option>
  );

  grabFileUpload = urlList => {
    _logger(urlList);
    this.setState(prevState => {
      return {
        ...prevState,
        urlList: urlList[0][0],
        formData: {
          ...prevState.formData,
          imageUrl: urlList[0][0]
        }
      };
    });
  };

  backToBlogs = e => {
    e.preventDefault();
    this.props.history.push("/blogs");
  };

  render() {
    _logger("render started");
    return (
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col">
          </div>
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            {" "}
            <button
              onClick={this.backToBlogs}
              className="btn btn-info btn-md mb-2"
            >
              Back to Blogs
            </button>
          </div>{" "}
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            <Card className="p-5 col-10">
              <Formik
                initialValues={this.state.formData}
                onSubmit={this.onAdd}
                enableReinitialize={this.addEditEnableReinitialize}
                validationSchema={BlogYup}
                render={formikProps => (
                  <Form>
                    <div className="row">
                      <div className="col d-flex justify-content-center pb-3">
                        <h1>{this.state.heading} Blog Here</h1>
                      </div>
                    </div>
                    <div className="form-row d-flex justify-content-center">
                      <div className="col">
                        {" "}
                        <FormGroup>
                          <Label>Title</Label>
                          <Field
                            name="title"
                            type="text"
                            placeholder=""
                            autoComplete="off"
                            component="input"
                            className={
                              formikProps.errors.title &&
                                formikProps.touched.title
                                ? "form-control error"
                                : "form-control"} />
                          {formikProps.errors.title &&
                            formikProps.touched.title && (
                              <span className="text-danger">
                                {formikProps.errors.title}
                              </span>)}
                        </FormGroup>
                      </div>
                      <div className="col">
                        <FormGroup>
                          <Label>Subject</Label>
                          <Field
                            name="subject"
                            type="text"
                            placeholder=""
                            autoComplete="off"
                            className={
                              formikProps.errors.subject &&
                                formikProps.touched.subject
                                ? "form-control error"
                                : "form-control"} />
                          {formikProps.errors.subject &&
                            formikProps.touched.subject && (
                              <span className="text-danger">
                                {formikProps.errors.subject}
                              </span>)}
                        </FormGroup>
                      </div>
                    </div>
                    <FormGroup>
                      <Label>Date Published</Label>
                      <Field
                        name="datePublish"
                        type="datetime"
                        placeholder=""
                        autoComplete="off"
                        className={
                          formikProps.errors.datePublish &&
                            formikProps.touched.datePublish
                            ? "form-control error"
                            : "form-control"} />
                      {formikProps.errors.datePublish &&
                        formikProps.touched.datePublish && (
                          <span className="text-danger">
                            {formikProps.errors.datePublish}
                          </span>)}
                    </FormGroup>
                    <FormGroup>
                      <Label>Blog Type</Label>
                      <Field
                        name="blogTypeId"
                        component="select"
                        label="Status"
                        className={
                          formikProps.errors.blogTypeId &&
                            formikProps.touched.blogTypeId
                            ? "form-control error"
                            : "form-control"}
                        as="select">
                        <option value="">Select...</option>
                        {this.state.mappedTypes}
                      </Field>
                      {formikProps.errors.blogTypeId &&
                        formikProps.touched.blogTypeId && (
                          <span className="text-danger">
                            {formikProps.errors.blogTypeId}
                          </span>)}
                    </FormGroup>

                    <FormGroup>
                      <BlogCKEditor
                        initialText={this.state.formData.content}
                        handleChange={evt =>
                          formikProps.setFieldValue(
                            "content",
                            evt.editor.getData())} />
                      {formikProps.errors.content &&
                        formikProps.touched.content &&
                        (<span className="text-danger">
                          {formikProps.errors.content}
                        </span>)}
                    </FormGroup>

                    <div className="row">
                      <div className="col d-flex justify-content-center px-2">
                        <EditorPreview data={this.state.content} />

                      </div>
                    </div>
                    <div className="row">
                      <div className="col d-flex justify-content-center">
                        <FileUpload AfterUpload={this.grabFileUpload} />
                      </div>
                      <div className="col d-flex justify-content-center">
                        <img
                          className="w-75"
                          src={this.state.formData.imageUrl}
                          alt=" " />
                      </div>
                    </div>

                    <FormGroup>
                      <EditorPreview data={formikProps.values.content} />
                    </FormGroup>
                    <FormGroup className="d-flex justify-content-center">
                      <Field
                        name="isPublished"
                        type="checkbox"
                        className="d-flex justify-content-center mt-1"
                        checked={formikProps.values.isPublished} />
                      <Label className="pl-3">Already Published?</Label>
                    </FormGroup>
                    <hr />
                    <div className="d-flex justify-content-center">
                      <div className="btn-group col-4" role="group">
                        <button className="btn btn-primary" type="submit">
                          Save
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={this.onCancelClick}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

BlogAddEditFormik.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      state: PropTypes.object
    })
  }),
  formik: PropTypes.shape({
    values: PropTypes.shape({
      content: PropTypes.string
    })
  })
};

export default BlogAddEditFormik;
