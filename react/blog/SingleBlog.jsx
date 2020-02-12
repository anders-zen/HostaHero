import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const _logger = debug.extend("Single Blog Page");
const SingleBlog = props => {
  const onEditClick = () => {
    props.onEditBlog(props.aBlogInfo);
  };

  const onDeleteClick = () => {
    props.onDeleteBlog(props.aBlogInfo.id);
    _logger(`SingleBlog props.aBlogInfo.id is: ${props.aBlogInfo.id}`);
  };

  const onReadClick = e => {
    e.preventDefault();
    _logger("on read click clicked");
    props.goToRead(props.aBlogInfo);
    window.scrollTo(0, 0);
  };

  const content = props.aBlogInfo.content;
  let truncContent = content.substring(0, 600);
  truncContent = truncContent + "...";

  return (
    <div className="card col-md-5 m-3 p-0">
      <div className="h-30 d-inline-block">
        <img
          className="card-img-top"
          alt="Card image cap"
          src={props.aBlogInfo.imageUrl}
          onClick={onReadClick} />
      </div>
      <div className="card-body" onClick={onReadClick}>
        <div className="card-title">
          <h5>{props.aBlogInfo.title}</h5>
        </div>
        <div
          className="card-text"
          dangerouslySetInnerHTML={{ __html: truncContent }}
        ></div>
      </div>
      {(props.userInfo.roles.indexOf("Administrator") >= 0) ?
        (<div className="row p-3">
          <div className="col justify-content-between card-footer">
            <button
              type="button"
              className="btn btn-wide btn-shadow btn-primary"
              onClick={onEditClick} >
              Edit
                    </button>
            <button
              type="button"
              className="btn btn-wide btn-shadow btn-danger"
              onClick={onDeleteClick}>
              Delete
          </button>
          </div></div>)
        : null}
    </div>
  );
};

SingleBlog.propTypes = {
  goToRead: PropTypes.func,
  getCards: PropTypes.func,
  ReadBlog: PropTypes.func,
  onEditBlog: PropTypes.func,
  onDeleteBlog: PropTypes.func,
  onRefreshBlog: PropTypes.func,
  roles: PropTypes.string,
  userInfo: PropTypes.shape({
    roles: PropTypes.array
  }),
  aBlogInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    blogTypeId: PropTypes.number,
    authorId: PropTypes.number,
    title: PropTypes.string,
    name: PropTypes.string,
    subject: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    currentPage: PropTypes.shape({
      selected: PropTypes.number
    })
  })
};

export default SingleBlog;
