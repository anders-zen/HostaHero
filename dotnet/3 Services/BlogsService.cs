using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using Sabio.Services.Interfaces;
using Sabio.Models;
using Sabio.Models.Requests.Blogs;

namespace Sabio.Services
{
    public class BlogService : IBlogService
    {
        IDataProvider _data = null;

        public BlogService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(BlogAddRequest model, int createdById)
        {
            int id = 0;

            string procName = "[dbo].[Blogs_Insert]";

            _data.ExecuteNonQuery(procName, 
                inputParamMapper: delegate (SqlParameterCollection col)
            {

                MapAddUpdate(col, model);

                col.AddWithValue("@authorId", createdById);


                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

                }, 
                returnParameters: delegate (SqlParameterCollection returnCol)
                {
                object oId = returnCol["@Id"].Value;
                Int32.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public Blog GetById(int Id)
        {

            string procName = "[dbo].[Blogs_Select_ById]";

            Blog blog = null;  

            _data.ExecuteCmd(procName, 
                delegate (SqlParameterCollection parameterCollection) {

                    parameterCollection.AddWithValue("@Id", Id);
            
            
                }, delegate(IDataReader reader, short set)
                {
                    blog = MapBlog(reader);

                }
        );
         return blog;
        }

        public Paged<Blog> GetAllPaginated(int pageIndex, int pageSize)
        {
            Paged<Blog> pagedList = null;
            List<Blog> data = null;
            int totalCount = 0;
            string procName = "[dbo].[Blogs_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper:
                delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@pageIndex", pageIndex);
                    paramCol.AddWithValue("@pageSize", pageSize);

                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Blog blogModel = MapBlog(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(12);
                    }
                    if (data == null)
                    {
                        data = new List<Blog>();
                    }

                    data.Add(blogModel);
             
                });

            if (data != null)
            {
                pagedList = new Paged<Blog>(data, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public void Update(BlogUpdateRequest model)
        {

            string storedProc = "[dbo].[Blogs_Update]";
            _data.ExecuteNonQuery(storedProc, inputParamMapper: delegate (SqlParameterCollection col)
            {
                MapAddUpdate(col, model);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);

        }

        public void Delete(int fileId)
        {
            string procName = "[dbo].[Blogs_Delete_ById]";

            _data.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@Id", fileId);
                },
                delegate (IDataReader reader, short set)
                { 
                });

        }

        public List<BlogTypes> GetBlogTypes()
        {
            List<BlogTypes> list = null;

            string procName = "[dbo].[BlogTypes_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                BlogTypes aType = new BlogTypes();
                int startingIndex = 0;

                aType.BlogTypeId = reader.GetSafeInt32(startingIndex++);
                aType.Name = reader.GetSafeString(startingIndex++);

                if (list == null)
                {
                    list = new List<BlogTypes>();
                }
                list.Add(aType);
            });
            return list;
        }



        private static Blog MapBlog(IDataReader reader)
            {
            int startingIndex = 0;
            Blog currentBlog = new Blog();

            currentBlog.Id = reader.GetSafeInt32(startingIndex++);
            currentBlog.BlogTypeId = reader.GetSafeInt32(startingIndex++);
            currentBlog.Name = reader.GetSafeString(startingIndex++);
            currentBlog.AuthorId = reader.GetSafeInt32(startingIndex++);
            currentBlog.Title = reader.GetSafeString(startingIndex++);
            currentBlog.Subject = reader.GetSafeString(startingIndex++);
            currentBlog.Content = reader.GetSafeString(startingIndex++);
            currentBlog.IsPublished = reader.GetBoolean(startingIndex++);
            currentBlog.ImageUrl = reader.GetSafeString(startingIndex++);
            currentBlog.DateCreated = reader.GetDateTime(startingIndex++);
            currentBlog.DateModified = reader.GetDateTime(startingIndex++);
            currentBlog.DatePublish = reader.GetDateTime(startingIndex++);
            
            return currentBlog;
        }

        private static void MapAddUpdate(SqlParameterCollection paramCollection, BlogAddRequest requestModel)
        {
            paramCollection.AddWithValue("@blogTypeId", requestModel.BlogTypeId);
            paramCollection.AddWithValue("@title", requestModel.Title);
            paramCollection.AddWithValue("@subject", requestModel.Subject);
            paramCollection.AddWithValue("@content", requestModel.Content);
            paramCollection.AddWithValue("@isPublished", requestModel.IsPublished);
            paramCollection.AddWithValue("@imageUrl", requestModel.ImageUrl);
            paramCollection.AddWithValue("@datePublish", requestModel.DatePublish);

        }
    }
}
