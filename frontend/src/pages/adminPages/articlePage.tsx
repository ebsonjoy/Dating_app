/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  useGetArticlesQuery, 
  useAddArticleMutation, 
  useBlockArticleMutation,
  useGetSingleArticleQuery,
  useUpdateArticleMutation,
  useGetAdminAdviceCategoriesQuery
} from "../../slices/adminApiSlice";

import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { IApiError } from "../../types/error.types";

interface ArticleFormData {
  title: string;
  content: string;
  image: File | null;
  categoryId: string;
}

const ArticleManagement: React.FC = () => {
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId: string }>();
  const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const { data: articles, isLoading, error, refetch } = useGetArticlesQuery();
  const typedError = error as IApiError;
  
  const { data: categories } = useGetAdminAdviceCategoriesQuery();
  const { data: singleArticle } = useGetSingleArticleQuery(articleId || '', {
    skip: !articleId
  });
  
  const [createArticle] = useAddArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [blockArticle] = useBlockArticleMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({ 
    title: '', 
    content: '', 
    image: null, 
    categoryId: '' 
  });

   useEffect(() => {
          if (!adminInfo || (typedError && typedError.status ==401)) {
            navigate('/admin/login');
          }
        }, [navigate, adminInfo, typedError])

  useEffect(() => {
    if (articleId && singleArticle) {
      setFormData({
        title: singleArticle.title || '',
        content: singleArticle.content || '',
        image: null,
        categoryId: singleArticle.categoryId || '',
      });
      setShowForm(true);
    }
  }, [articleId, singleArticle]);

  // Clear file input
  const clearFileInput = () => {
    setFormData({ ...formData, image: null });
  };


  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!formData.title.trim()) {
      alert('Article title is required');
      return;
    }
  
    if (!formData.content.trim()) {
      alert('Article content is required');
      return;
    }
  
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }
  
    // Validate image for new article
    if (!articleId && !formData.image) {
      alert('Please upload an image');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("categoryId", formData.categoryId);
  
      // Append image only if it's a new file
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }
  
      if (articleId) {
        // Update existing article
        await updateArticle({ articleId, formData: formDataToSend }).unwrap();
        navigate('/admin/article');
      } else {
        // Create new article
        await createArticle(formDataToSend);
        navigate('/admin/article');
      }
      
      // Reset form
      setShowForm(false);
      setFormData({ title: '', content: '', image: null, categoryId: '' });
      refetch();
    } catch (err) {
      console.error("Failed to submit article:", err);
      alert('Failed to submit article. Please try again.');
    }
  };

  const handleBlockToggle = async (articleId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const updated = await blockArticle({ articleId, newStatus });
      if (updated) {
        refetch();
      }
    } catch (err) {
      console.error("Failed to block article:", err);
      alert('Failed to update article status. Please try again.');
    }
  };

  // Loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading articles</div>;

  // No articles found
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header title="Article Management" />
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-700">No articles found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title={articleId ? "Edit Article" : "Article Management"} />
        <div className="flex-1 bg-gray-100">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
              {!articleId && (
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 md:mt-0"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : 'Add Article'}
                </button>
              )}
              <Link 
                to="/admin/adviceCatergory" 
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mt-4 md:mt-0"
              >
                Category Management
              </Link>
            </div>

            {(showForm || articleId) && (
              <div className="mb-4 border p-4 rounded bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    className="p-2 border rounded w-full"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <select
                    className="p-2 border rounded w-full"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((category: any) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="p-2 border rounded w-full"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                         
                          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                          if (!allowedTypes.includes(file.type)) {
                            alert('Please upload a valid image (JPEG, PNG, or GIF)');
                            e.target.value = ''; 
                            return;
                          }

                          // Validate file size (e.g., max 5MB)
                          const maxSize = 5 * 1024 * 1024; // 5MB
                          if (file.size > maxSize) {
                            alert('File size should not exceed 5MB');
                            e.target.value = ''; 
                            return;
                          }

                          setFormData({ ...formData, image: file });
                        }
                      }}
                    />
                    {formData.image && (
                      <button
                        type="button"
                        onClick={clearFileInput}
                        className="absolute top-0 right-0 mt-1 mr-1 text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  placeholder="Content"
                  className="w-full p-2 border rounded mt-4"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <button 
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4"
                  onClick={handleSubmitArticle}
                >
                  {articleId ? 'Update Article' : 'Submit Article'}
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Content Preview</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article: any) => (
                    <tr key={article._id} className="border-b">
                      <td className="p-4">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 text-gray-700">{article.title}</td>
                      <td className="p-4 text-gray-700">
                        {categories?.find((cat: any) => cat._id === article.categoryId)?.name || 'Uncategorized'}
                      </td>
                      <td className="p-4 text-gray-700">
                        {article.content.split(' ').slice(0, 5).join(' ')}...
                      </td>
                      <td className="p-4 text-gray-700">
                        {article.isBlock ? 'Blocked' : 'Active'}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            className={`px-3 py-1 text-white rounded-md mr-2 ${article.isBlock ? "bg-green-500" : "bg-red-500"} hover:opacity-80 transition-opacity`}
                            onClick={() => handleBlockToggle(article._id, article.isBlock)}
                          >
                            {article.isBlock ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition duration-200"
                            onClick={() => navigate(`/admin/editArticle/${article._id}`)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleManagement;