import React, { useState, useEffect } from "react";
import Navbar from "../../components/admin/adminNavBar";
import Header from "../../components/admin/adminHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAdminAdviceCategoriesQuery,
  useAddAdviceCategoryMutation,
  useBlockAdviceCategoryMutation,
  useGetSingleAdviceCategoryQuery,
  useUpdateAdviceCategoryMutation,
  useGetPresignedUrlsAdminMutation,
} from "../../slices/adminApiSlice";
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { IApiError } from "../../types/error.types";
import { toast } from "react-toastify";
import axios from "axios";

interface ICategory {
  _id: string;
  image: string;
  name: string;
  description: string;
  isBlock: boolean;
}

const AdviceManagement: React.FC = () => {
      const { adminInfo } = useSelector((state: RootState) => state.adminAuth);
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetAdminAdviceCategoriesQuery();
  const [getPresignedUrls] = useGetPresignedUrlsAdminMutation();

  const typedError = error as IApiError;
  const { data: singleCategory } = useGetSingleAdviceCategoryQuery(
    categoryId || "",
    {
      skip: !categoryId,
    }
  );
  const [createCategory] = useAddAdviceCategoryMutation();
  const [updateCategory] = useUpdateAdviceCategoryMutation();
  const [blockCategory] = useBlockAdviceCategoryMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: File | null;
  }>({
    name: "",
    description: "",
    image: null,
  });
 useEffect(() => {
        if (!adminInfo || (typedError && typedError.status ==401)) {
          navigate('/admin/login');
        }
      }, [navigate, adminInfo, typedError])
  
  useEffect(() => {
    if (categoryId && singleCategory) {
      setFormData({
        name: singleCategory.name || "",
        description: singleCategory.description || "",
        image: null,
      });
      setShowForm(true);
    }
  }, [categoryId, singleCategory]);

  const uploadToS3 = async (file: File, signedUrl: string) => {
    try {
      await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      return true;
    } catch (error) {
      console.error('S3 upload error:', error);
      toast.error('Failed to upload image');
      return false;
    }
  };


  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!formData.name.trim()) {
      alert("Category name is required");
      return;
    }

    if (!formData.description.trim()) {
      alert("Category description is required");
      return;
    }


    if (!categoryId && !formData.image) {
      alert("Please upload an image");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);

 
      if (formData.image instanceof File) {
        const response = await getPresignedUrls({ fileTypes: [formData.image.type] });
        if (!response.data || !response.data.signedUrls) {
          toast.error('Failed to generate upload URL');
          return;
        }
        const uploadSuccess = await uploadToS3(formData.image, response.data.signedUrls[0].signedUrl);
        if (!uploadSuccess) {
          return;
        }
        formDataToSend.append("image", response.data.signedUrls[0].publicUrl);
      }
      console.log("Form Data Contents:");
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      if (categoryId) {
       
        await updateCategory({ categoryId, formData: formDataToSend }).unwrap();
        navigate("/admin/adviceCatergory");
        toast.success('Advice Is Updated');
        
      } else {
     
        await createCategory(formDataToSend);
        navigate("/admin/adviceCatergory");
        toast.success('New Advice Is Created');
        
      }

      setShowForm(false);
      setFormData({ name: "", description: "", image: null });
      refetch();
    } catch (err) {
      console.error("Failed to submit category:", err);
      alert("Failed to submit category. Please try again.");
    }
  };

  const clearFileInput = () => {
    setFormData({ ...formData, image: null });
  };

  const handleBlockToggle = async (
    categoryId: string,
    currentStatus: boolean
  ) => {
    try {
      const newStatus = !currentStatus;
      const updated = await blockCategory({ categoryId, newStatus });
      if (updated) {
        refetch();
      }
    } catch (err) {
      console.error("Failed to block category:", err);
    }
  };

  // Loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  // No categories found
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header title="Advice Management" />
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-700">
                No advice categories found.
              </p>
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
        <Header title={categoryId ? "Edit Category" : "Advice Management"} />
        <div className="flex-1 bg-gray-100">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
              {!categoryId && (
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 md:mt-0"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "Cancel" : "Add Category"}
                </button>
              )}
              <Link
                to="/admin/article"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mt-4 md:mt-0"
              >
                Article Management
              </Link>
            </div>

            {(showForm || categoryId) && (
              <div className="mb-4 border p-4 rounded bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="p-2 border rounded w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="p-2 border rounded w-full"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/WEBP"
                      className="p-2 border rounded w-full"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];

                          // Validate file type
                          const allowedTypes = [
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                            "image/WEBP",
                          ];
                          if (!allowedTypes.includes(file.type)) {
                            alert(
                              "Please upload a valid image (JPEG, PNG, or GIF)"
                            );
                            e.target.value = "";
                            return;
                          }
                          const maxSize = 5 * 1024 * 1024;
                          if (file.size > maxSize) {
                            alert("File size should not exceed 5MB");
                            e.target.value = "";
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
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4"
                  onClick={handleSubmitCategory}
                >
                  {categoryId ? "Update Category" : "Submit Category"}
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-800 text-white text-left">
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {(categories as ICategory[]).map((category) => (
                    <tr key={category._id} className="border-b">
                      <td className="p-4">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 text-gray-700">{category.name}</td>
                      <td className="p-4 text-gray-700">
                        {category.description}
                      </td>
                      <td className="p-4 text-gray-700">
                        {category.isBlock ? "Blocked" : "Active"}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            className={`px-3 py-1 text-white rounded-md mr-2 ${
                              category.isBlock ? "bg-green-500" : "bg-red-500"
                            } hover:opacity-80 transition-opacity`}
                            onClick={() =>
                              handleBlockToggle(category._id, category.isBlock)
                            }
                          >
                            {category.isBlock ? "Unblock" : "Block"}
                          </button>
                          <button
                            className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition duration-200"
                            onClick={() =>
                              navigate(
                                `/admin/editAdviceCatergory/${category._id}`
                              )
                            }
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

export default AdviceManagement;
