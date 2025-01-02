import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { useGetAdviceCategoriesQuery, useGetArticlesByCategoryQuery } from "../../slices/apiUserSlice";
import { IAdviceCategory, IArticle } from "../../types/advice.types";
import { ChevronLeft, ArrowLeft, BookOpen, Search, Sparkles, BookmarkIcon, LayersIcon } from 'lucide-react';


const AdvicePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useGetAdviceCategoriesQuery();

  // Fetch articles for the selected category
  const { data: articles, isLoading: loadingArticles } = useGetArticlesByCategoryQuery(
    selectedCategory!,
    { skip: !selectedCategory }
  );

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };

  // Handle article click
  const handleArticleClick = (article: IArticle) => {
    setSelectedArticle(article);
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedArticle(null);
  };

  // Handle back to articles
  const handleBackToArticles = () => {
    setSelectedArticle(null);
  };

  // Render loading state
  if (loadingCategories) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-rose-50 to-pink-50 overflow-hidden">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 p-8 bg-white/70 rounded-xl shadow-2xl">
            <Sparkles className="animate-pulse text-purple-500" size={64} />
            <p className="text-3xl font-semibold text-purple-800 tracking-wide">
              Gathering Wisdom...
            </p>
            <p className="text-gray-600 text-center">
              Preparing your personalized insights and advice
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render full article view
  if (selectedArticle) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-rose-50 to-pink-50 overflow-hidden">
        <Navbar />
        <div className="flex-grow flex shadow-2xl">
          {/* Image Section */}
          <div className="w-1/2 relative">
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/30"></div>
          </div>
          
          {/* Content Section */}
          <div className="w-1/2 p-10 overflow-y-auto bg-white shadow-lg relative">
            <button 
              onClick={handleBackToArticles} 
              className="absolute top-4 left-4 flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors group"
            >
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Articles
            </button>
            
            <div className="pt-12">
              <h1 className="text-5xl font-bold mb-6 text-gray-800 border-b-4 border-purple-500 pb-4">
                {selectedArticle.title}
              </h1>
              <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-lg">
                <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-purple-500 first-letter:mr-3 first-letter:float-left">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render articles for a selected category
  if (selectedCategory) {
    const filteredArticles = articles?.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-100 overflow-hidden">
        <Navbar />
        <div className="flex-grow p-8 overflow-hidden">
          <button 
            onClick={handleBackToCategories} 
            className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors group"
          >
            <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Categories
          </button>
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 flex items-center">
              <LayersIcon className="mr-4 text-purple-500" size={36} />
              {categories?.find(cat => cat._id === selectedCategory)?.name} Articles
            </h2>
            <div className="relative">
              <input 
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-purple-200 rounded-full focus:ring-4 focus:ring-purple-300 transition-all w-96"
              />
              <Search className="absolute left-3 top-4 text-purple-400" size={20} />
            </div>
          </div>
          
          {loadingArticles ? (
            <div className="text-center">
              <BookOpen className="mx-auto animate-bounce text-purple-500" size={64} />
              <p className="text-2xl text-gray-600 mt-4">Loading articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full overflow-y-auto pr-2">
              {filteredArticles?.map((article: IArticle) => (
                <div 
                  key={article._id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl group cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-56 object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <BookmarkIcon className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600">
                      {article.content.length > 150
                        ? `${article.content.slice(0, 150)}...`
                        : article.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render categories view
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-rose-50 to-pink-50 overflow-hidden">
      <Navbar />
      <div className="flex-grow p-8">
        <h1 className="text-5xl font-bold mb-12 text-center text-gray-800 tracking-wide">
          Explore Advice Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories?.map((category: IAdviceCategory) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer group"
              onClick={() => handleCategoryClick(category._id)}
            >
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-56 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold tracking-wide">
                  {category.name}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-center">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvicePage;