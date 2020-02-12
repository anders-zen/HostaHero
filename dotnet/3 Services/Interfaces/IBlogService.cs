using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Blogs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services.Interfaces
{
    public interface IBlogService
    {
        int Add(BlogAddRequest model, int createdById);
        Blog GetById(int id);
        Paged<Blog> GetAllPaginated(int pageIndex, int pageSize);
        void Update(BlogUpdateRequest model); 
        void Delete(int id);
        List<BlogTypes> GetBlogTypes();



    }
}
