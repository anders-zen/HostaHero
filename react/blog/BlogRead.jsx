import React from "react";
import PropTypes from "prop-types";
import styles from "./blogs.module.css";


const BlogRead = props => {
  const backToBlogs = (e) => {
    e.preventDefault();
    props.history.push("/blogs");
  };
  const dateFormatting = date => {
    let created = new Date(date);
    let options = { month: "numeric", day: "numeric", year: "numeric" };
    let localDate = created.toLocaleDateString("en-US", options);
    return localDate;
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col d-flex justify-content-center">
          {" "}
          <button onClick={backToBlogs} className="btn btn-info btn-md mb-2">
            Back to Blogs
          </button>
        </div>{" "}
      </div>

      <div className="row d-flex justify-content-center">
        <div className="card p-0 col-10 m-3">
          <img
            src={props.history.location.state.imageUrl}
            className={styles._cardImages}
            alt=" "
          />

          <div className="card-body p-5">
            <h2>{props.history.location.state.title}</h2>
            <p>{props.history.location.state.subject}</p>
            <div>
              <hr />
              <p>
                Published:{"  "}
                {dateFormatting(props.history.location.state.datePublish)}
              </p>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: props.history.location.state.content
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

BlogRead.propTypes = {
  currentPage: PropTypes.number,
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        authorId: PropTypes.number,
        blogTypeId: PropTypes.number,
        name: PropTypes.string,
        title: PropTypes.string,
        subject: PropTypes.string,
        content: PropTypes.string,
        isPublished: PropTypes.bool,
        datePublish: PropTypes.string,
        imageUrl: PropTypes.string.isRequired
      })
    }),
    push: PropTypes.func
  })
};

export default BlogRead;
