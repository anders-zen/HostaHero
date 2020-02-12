import React from "react";
import PropTypes from "prop-types";
import CKEditor from "ckeditor4-react";
const BlogCKEditor = props => {
  return (
    <CKEditor
      onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
      name="CKEditorName"
      data={props.initialText}
      onChange={props.handleChange}
    />
  );
};

export default BlogCKEditor;

BlogCKEditor.propTypes = {
  handleChange: PropTypes.func,
  data: PropTypes.string,
  handler: PropTypes.string,
  initialText: PropTypes.string
};
