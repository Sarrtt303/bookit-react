import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { Experience, ApiResponse } from '../types/Bookings';

const Home = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          ...(searchQuery && { search: searchQuery })
        });

        const response = await fetch(`https://bookit-node.onrender.com/api/experiences?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }

        const result = await response.json() as ApiResponse<Experience[]>;
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch experiences');
        }

        setExperiences(result.data);
        setTotalPages(result.pages || 1);
        
        
        // // Mock data for now
        // const mockData: Experience[] = [
        //   {
        //     id: '1',
        //     name: 'Sunset Yoga Session',
        //     description: 'Relaxing yoga session during golden hour with ocean views',
        //     image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
        //     price: 45,
        //     duration: '90 mins',
        //     category: 'Wellness',
        //     rating: 4.8
        //   },
        //   {
        //     id: '2',
        //     name: 'Mountain Hiking Adventure',
        //     description: 'Guided trek through scenic mountain trails',
        //     image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
        //     price: 75,
        //     duration: '4 hours',
        //     category: 'Adventure',
        //     rating: 4.9
        //   },
        //   {
        //     id: '3',
        //     name: 'Culinary Workshop',
        //     description: 'Learn authentic Italian cooking with master chefs',
        //     image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
        //     price: 120,
        //     duration: '3 hours',
        //     category: 'Food',
        //     rating: 4.7
        //   },
        //   {
        //     id: '4',
        //     name: 'Photography Tour',
        //     description: 'Capture stunning cityscapes with professional guidance',
        //     image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
        //     price: 60,
        //     duration: '2 hours',
        //     category: 'Arts',
        //     rating: 4.6
        //   },
        //   {
        //     id: '5',
        //     name: 'Wine Tasting Experience',
        //     description: 'Sample premium wines from local vineyards',
        //     image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
        //     price: 95,
        //     duration: '2.5 hours',
        //     category: 'Food & Drink',
        //     rating: 4.8
        //   },
        //   {
        //     id: '6',
        //     name: 'Surfing Lessons',
        //     description: 'Beginner-friendly surf lessons on pristine beaches',
        //     image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop',
        //     price: 80,
        //     duration: '2 hours',
        //     category: 'Water Sports',
        //     rating: 4.9
        //   }
        // ];
        
        // setExperiences(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Experiences</h1>
            
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'} found
              </p>
            </div>

            {experiences.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No experiences found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <div
                    key={experience._id}
                    onClick={() => navigate(`/experience/${experience._id}`)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={experience.coverPhoto || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={experience.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                        ₹{experience.pricePerPerson}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-200 px-2 py-1 rounded">
                          {experience.type}
                        </span>
                        {experience.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{experience.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {experience.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {experience.shortDescription}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {experience.timeLength}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <div className="px-4 py-2 text-sm text-gray-700">
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;