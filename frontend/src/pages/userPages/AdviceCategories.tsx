import React, { useState } from 'react';
import Navbar from '../../components/user/Navbar';
import { useGetAdviceCategoriesQuery, useGetArticlesByCategoryQuery } from "../../slices/apiUserSlice";
import { IAdviceCategory, IArticle } from "../../types/advice.types";
import { ChevronLeft, ArrowLeft, BookOpen, Search, Sparkles, BookmarkIcon, LayersIcon, HeartIcon } from 'lucide-react';
import ErrorDisplay from '../../components/user/errorDisplay';
import { IApiError } from '../../types/error.types';

const AdvicePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: categories, isLoading: loadingCategories, error } = useGetAdviceCategoriesQuery();

  const { data: articles, isLoading: loadingArticles, error: isCategoryError } = useGetArticlesByCategoryQuery(
    selectedCategory!,
    { skip: !selectedCategory }
  );

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };

  const handleArticleClick = (article: IArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedArticle(null);
  };

  const handleBackToArticles = () => {
    setSelectedArticle(null);
  };

  if (error) {
    console.log('errrrrrrrrrrrr',error)
    return <ErrorDisplay error={error as IApiError} />;
  } else if (isCategoryError) {
    return <ErrorDisplay error={isCategoryError as IApiError} />;
  }

  if (loadingCategories) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-100 to-pink-100">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-6 p-10 bg-white/80 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="relative">
              <Sparkles className="text-pink-500 animate-pulse" size={80} />
              <HeartIcon className="text-purple-600 animate-bounce absolute -top-2 -right-2" size={32} />
            </div>
            <p className="text-4xl font-bold text-purple-800 tracking-wide text-center">
              Finding Love Advice...
            </p>
            <p className="text-xl text-gray-600 text-center max-w-md">
              We're gathering the perfect relationship insights just for you
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-100 to-pink-100">
        <Navbar />
        <div className="flex flex-col lg:flex-row flex-grow shadow-2xl m-4 rounded-2xl overflow-hidden">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 relative h-64 lg:h-auto">
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-pink-800/30"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg lg:hidden">
                {selectedArticle.title}
              </h1>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto bg-white shadow-lg relative">
            <button 
              onClick={handleBackToArticles} 
              className="flex items-center text-pink-600 hover:text-pink-800 mb-4 transition-colors group"
            >
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Articles
            </button>
            
            <div className="pt-4 lg:pt-8">
              <h1 className="hidden lg:block text-4xl font-bold mb-6 text-gray-800 border-b-4 border-pink-500 pb-4">
                {selectedArticle.title}
              </h1>
              <div className="mt-6 space-y-4 text-gray-700 leading-relaxed text-lg">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-pink-500 first-letter:mr-3 first-letter:float-left">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const filteredArticles = articles?.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <Navbar />
        <div className="flex-grow p-4 md:p-8 overflow-auto">
          <button 
            onClick={handleBackToCategories} 
            className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors group"
          >
            <ChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Categories
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
              <LayersIcon className="mr-4 text-pink-500" size={36} />
              {categories?.find(cat => cat._id === selectedCategory)?.name} Articles
            </h2>
            <div className="relative w-full md:w-auto">
              <input 
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-pink-200 rounded-full focus:ring-4 focus:ring-pink-300 transition-all w-full md:w-96 text-gray-700 bg-white"
              />
              <Search className="absolute left-3 top-4 text-pink-400" size={20} />
            </div>
          </div>
          
          {loadingArticles ? (
            <div className="text-center py-20">
              <BookOpen className="mx-auto animate-pulse text-purple-500" size={64} />
              <p className="text-2xl text-gray-600 mt-4">Loading articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {filteredArticles && filteredArticles.length > 0 ? (
                filteredArticles.map((article: IArticle) => (
                  <div 
                    key={article._id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-103 hover:shadow-2xl group cursor-pointer h-full flex flex-col"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-56 object-cover transition-transform group-hover:scale-105 duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <BookmarkIcon className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 flex-grow">
                        {article.content.length > 150
                          ? `${article.content.slice(0, 150)}...`
                          : article.content}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-pink-500 group-hover:text-pink-700 font-medium flex items-center">
                          Read more <ChevronLeft className="ml-1 rotate-180" size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-2xl text-gray-600">No articles found. Try a different search term.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render categories view
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-100 to-pink-100">
      <Navbar />
      <div className="flex-grow p-4 md:p-8 overflow-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-12 text-center text-gray-800 tracking-wide">
          Discover Relationship <span className="text-pink-600">Advice</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
          {categories?.map((category: IAdviceCategory) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer group h-full flex flex-col"
              onClick={() => handleCategoryClick(category._id)}
            >
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-52 object-cover transition-transform group-hover:scale-110 duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 right-4 text-white text-2xl font-bold tracking-wide">
                  {category.name}
                </h3>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 text-pink-500 group-hover:text-pink-700 font-medium flex items-center">
                  Explore articles <ChevronLeft className="ml-1 rotate-180" size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvicePage;