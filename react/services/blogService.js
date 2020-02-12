import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";
import axios from "axios";
let endPoint = API_HOST_PREFIX + "/api/blogs";

let createBlog = blogData => {
  let config = {
    method: "POST",
    url: endPoint,
    withCredentials: true,
    // crossdomain: true,
    data: blogData,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

let getBlogById = blogId => {
  let config = {
    method: "GET",
    url: endPoint + "/" + blogId,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return axios(config)
    .then(onGlobalSuccess) //shouldn't use if I need custom outputs
    .catch(onGlobalError);
};

let getBlogs = (pageIndex, pageSize) => {
  let page = pageIndex === undefined ? 0 : pageIndex;
  let url = endPoint + `?pageIndex=${page}&pageSize=${pageSize}`;

  let config = {
    method: "GET",
    url: url,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

let updateBlog = (id, payload) => {
  let url = endPoint + "/" + id;

  let config = {
    method: "PUT",
    url: url,
    withCredentials: true,
    crossdomain: true,
    data: payload,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

let deleteBlog = (id) => {
  let url = endPoint + "/" + id;

  let config = {
    method: "DELETE",
    url: url,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

let getBlogTypes = () => {
  let url = endPoint + "/types";

  let config = {
    method: "GET",
    url: url,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError)
};

export {
  createBlog,
  getBlogById,
  getBlogs,
  updateBlog,
  deleteBlog,
  getBlogTypes
};



