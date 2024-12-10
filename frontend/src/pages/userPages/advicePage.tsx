import React from 'react';

const AdvicePage: React.FC = () => {
  const adviceCategories = [
    { id: 1, title: 'First Date Tips', description: 'Make your first date memorable with these tips.' },
    { id: 2, title: 'Conversation Starters', description: 'Break the ice with these fun and engaging starters.' },
    { id: 3, title: 'Building Trust', description: 'Learn how to build trust in your relationship.' },
    { id: 4, title: 'Safety Tips', description: 'Stay safe while dating online or in person.' },
  ];

  return (
    <div className="advice-page bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dating Advice</h1>
        <p className="text-lg text-gray-600 mt-2">Tips for Building Meaningful Connections</p>
      </header>

      {/* Featured Advice */}
      <section className="mb-8">
        <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-yellow-800">Featured Advice</h2>
          <p className="text-gray-700 mt-2">
            "A successful date starts with a positive mindset. Be yourself and let the connection flow!"
          </p>
        </div>
      </section>

      {/* Advice Categories */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adviceCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
              <p className="text-gray-600 mt-2">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">FAQs</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">How to make my profile stand out?</h3>
            <p className="text-gray-600 mt-2">
              Focus on writing an engaging bio and uploading clear, attractive photos.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">What to do if my date is shy?</h3>
            <p className="text-gray-600 mt-2">
              Be patient, ask open-ended questions, and create a relaxed environment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvicePage;
