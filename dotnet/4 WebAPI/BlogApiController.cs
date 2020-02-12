using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Blogs;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/blogs")]
    [ApiController]
    public class BlogApiController : BaseApiController
    {
        private IBlogService _blogService = null;
        private IAuthenticationService<int> _authenticationService = null;

        public BlogApiController(IBlogService blogService, IAuthenticationService<int> authService,
           ILogger<BlogApiController> logger) : base(logger)
        {
            _authenticationService = authService;
            _blogService = blogService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<Blog>> Add(BlogAddRequest model)
        {
            int iCode = 200;
            BaseResponse response;

            try
            {
                int createdById = _authenticationService.GetCurrentUserId();
                UserVeteranBase user = _authenticationService.GetCurrentUser();

                int id = _blogService.Add(model, createdById);
                response = new ItemResponse<int>() { Item = id };
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                iCode = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Blog>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Blog blog = _blogService.GetById(id);

                if (blog == null)
                {
                    iCode = 404;
                    response = new ErrorResponse($"App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Blog>() { Item = blog };
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                iCode = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<Blog>>> GetAllPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Blog> page = _blogService.GetAllPaginated(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Blog>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> UpdateBlog(BlogUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _blogService.Update(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> DeleteBlog(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _blogService.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse($"Generic Exception: {ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet("types")]
        public ActionResult<ItemResponse<List<BlogTypes>>> GetBlogTypes()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<BlogTypes> list = _blogService.GetBlogTypes();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Blog Type Resource not Found.");
                }
                else
                {
                    code = 200;
                    response = new ItemResponse<List<BlogTypes>> { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}