import React from "react";
import PropTypes from "prop-types";

class EditorPreview extends React.Component {
  render() {
    return (
      <div className="editor-preview">
        <hr />
        <div dangerouslySetInnerHTML={{ __html: this.props.data }}></div>
      </div>
    );
  }
}
EditorPreview.propTypes = {
  data: PropTypes.string
};

export default EditorPreview;
