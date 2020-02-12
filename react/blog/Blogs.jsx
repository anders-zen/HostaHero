import React from "react";
import Swal from "sweetalert2";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import SingleBlog from "./SingleBlog";
import { toast } from "react-toastify";
import styles from "./blogs.module.css";
import ReactPaginate from "react-paginate";
import { Jumbotron, Row } from "reactstrap";
import * as blogService from "../../services/blogService";

const _logger = debug.extend("Blog Main Page");

class Blogs extends React.Component {
  state = {
    mappedBlogs: [],
    deletedBlog: 0,
    currentPage: 0,
    totalPages: 0
  };

  componentDidMount() {
    this.getCards(this.state.currentPage);
    _logger("componentDidMount");
  }

  stateChanged = () => {
    _logger("state change", this.state);
  };

  onAddBlogClick = e => {
    e.preventDefault();
    this.props.history.push("blogs/add");
  };

  onPageChange = page => {
    this.setState(prevState => ({ ...prevState, currentPage: page }));
    return this.getCards(page.selected);
  };

  getCards = pageNumber => {
    _logger(pageNumber);
    blogService
      .getBlogs(pageNumber, 6)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onGetAllSuccess = response => {
    this.setState(() => {
      return {
        mappedBlogs: response.item.pagedItems.map(this.mapBlogAdditional),
        totalPages: response.item.totalPages
      };
    });
    window.scrollTo(0, 0);
  };

  onGetAllError = () => {
    Swal.fire("Unable to Access Requested Blogs");
  };

  onUpdateRequested = blog => {
    _logger(`this is blog coming from onUpdateRequested: ${blog.title}`);
    this.props.history.push(`/blogs/${blog.id}/edit`, blog);
  };

  onReadRequested = blog => {
    this.props.history.push(`/blogs/read/${blog.id}`, blog);
  };

  onDeleteRequested = passedUpId => {
    _logger("on Delete Requested", { passedUpId: passedUpId });
    this.setState(() => {
      return {
        deletedBlog: passedUpId
      };
    });

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#566C2E",
      cancelButtonColor: "#7D0200",
      confirmButtonText: "Yes, delete it!"
    }).then(willDelete => {
      if (willDelete.value) {
        this.removeBlogService(passedUpId);
      } else {
        Swal.fire({
          text: "Your blog is safe!",
          confirmButtonColor: "#566C2E"
        });
      }
    });
  };

  removeBlogService = id => {
    this.setState(() => {
      const indexOfBlog = this.state.mappedBlogs.findIndex(
        element => element.props.aBlogInfo.id === id
      );
      const updatedBlogs = [...this.state.mappedBlogs];
      _logger(`here is the indexOfBlog: ${indexOfBlog}`);
      if (indexOfBlog >= 0) {
        updatedBlogs.splice(indexOfBlog, 1);
      }
      _logger(`this.state.deletedBlog: ${this.state.deletedBlog}`);

      return {
        mappedBlogs: updatedBlogs
      };
    }, this.stateChanged);

    _logger(`Removing Blog Service Id is: ${id}`);
    blogService
      .deleteBlog(id)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteFail);
  };
  onDeleteSuccess = () => {
    toast("Blog has been deleted!");
    _logger("successfully deleted blog ");
    _logger(`Current Page: ${this.state.currentPage}`);
    this.setState({ isRemovedButtonClicked: true });
  };
  onDeleteFail = () => {
    Swal.fire("Blog Delete Unsuccessful");
  };

  mapBlogAdditional = aBlog => {
    return (
      <SingleBlog
        userInfo={this.props.currentUser}
        aBlogInfo={aBlog}
        key={aBlog.id}
        onEditBlog={this.onUpdateRequested}
        onDeleteBlog={this.onDeleteRequested}
        goToRead={this.onReadRequested}
      />
    );
  };

  render() {
    return (
      <div>
        <div>
          <Jumbotron className={styles._jumboTron}>
            <h1 className="display-4">Host-a-Hero Blogs</h1>
            <p className="lead">
              Explore the articles below to get inspired on where your next
              adventure should take you.
            </p>
            {(this.props.currentUser.roles.indexOf("Administrator") >= 0) ?
              (<div>
                <p>Click below to add a new blog  </p>

                <div>
                  <button
                    className="btn-wide btn-shadow m-1 btn btn-primary"
                    onClick={this.onAddBlogClick}>
                    New Blog
                </button>
                </div><i>(Sorted by Date Published)</i>
              </div>) : null}
          </Jumbotron>
        </div>
        <div className="container-fluid">
          <Row className="d-flex justify-content-center">
            {this.state.mappedBlogs}
          </Row>
        </div>
        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.totalPages}
            marginPagesDisplayed={5}
            pageRangeDisplayed={2}
            onPageChange={this.onPageChange}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    );
  }
}

Blogs.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.array
  }),
  aBlogInfo: PropTypes.shape({
    id: PropTypes.number
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default Blogs;
