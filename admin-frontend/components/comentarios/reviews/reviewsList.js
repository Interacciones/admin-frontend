import { useState, useEffect } from 'react'
import { UserAuth } from '../../context/AuthContext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function ReviewsList() {
  const [reviewsData, setReviewsData] = useState({
    totalReviewsCount: 0,
    reviewsPerUser: []
  });
  const [expandedUsers, setExpandedUsers] = useState({});
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        await fetchReviews();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/admin-stats/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
        },
      });
      const result = await response.json();
      setReviewsData(result.data);
    } catch (error) {
      console.error('Error fetching review data:', error);
    }
  };

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 w-5/6">
      <div className="mx-auto max-w-2xl text-center py-4">
        <h2 className="text-3xl font-sans tracking-tight text-gray font-semibold sm:text-4xl">
          Comentarios
        </h2>
      </div>
      <main className="flex flex-col items-center justify-between mx-4 bg-white dark:bg-slate-900 p-2 pt-6">
        <div className="container mx-auto bg-white dark:bg-slate-900 mb-16">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">Total de comentarios: {reviewsData.totalReviewsCount}</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewsData.reviewsPerUser && reviewsData.reviewsPerUser.map((userReview) => (
                <div 
                  key={userReview.id}
                  className="border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
                >
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 dark:bg-gray-700"
                    onClick={() => toggleUserExpand(userReview.id)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {userReview.name} {userReview.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{userReview.email}</p>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        {userReview.reviewCount} comentario{userReview.reviewCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      {expandedUsers[userReview.id] ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {expandedUsers[userReview.id] && (
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                        Tutores comentados:
                      </h4>
                      <ul className="space-y-2">
                        {userReview.reviewedTutors.map((tutor) => (
                          <li 
                            key={tutor.tutorId}
                            className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tutor.tutorName} {tutor.tutorLastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {tutor.tutorEmail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 