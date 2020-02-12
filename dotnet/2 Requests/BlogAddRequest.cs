using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Blogs
{
    public class BlogAddRequest
    {
		[Required]
		public int BlogTypeId { get; set; }
		[Required]
		[StringLength(50, MinimumLength = 2, ErrorMessage = "Title cannot exceed 50 characters")]
		public string Title { get; set; }
		[Required]
		[StringLength(120, MinimumLength = 2, ErrorMessage = "Subject cannot exceed 120 characters")]
		public string Subject { get; set; }
		[Required]
		[StringLength(1000000, MinimumLength = 40, ErrorMessage = "Content must exceed 40 characters")]
		public string Content { get; set; }
		[Required]
		public bool IsPublished { get; set; }
		[StringLength(225, ErrorMessage = "Image Url cannot exceed 225 characters")]
		public string ImageUrl { get; set; }
		
		public DateTime DatePublish { get; set; }

	}
}
