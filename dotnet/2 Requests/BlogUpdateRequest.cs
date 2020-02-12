using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Blogs
{
    public class BlogUpdateRequest : BlogAddRequest, IModelIdentifier
    {
        [Required] 
        public int Id { get; set; }
    }
}
