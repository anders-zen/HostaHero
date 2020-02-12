using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Blog
    {
		public int Id { get; set; }
		public int BlogTypeId { get; set; }
		public string Name { get; set; }
		public int AuthorId { get; set; }	
		public string Title { get; set; }
		public string Subject { get; set; }
		public string Content { get; set; }
		public bool IsPublished { get; set; }
		public string ImageUrl { get; set; }
		public DateTime DateCreated { get; set; }
		public DateTime DateModified { get; set; }
		public DateTime DatePublish { get; set; }
		
	}
}
