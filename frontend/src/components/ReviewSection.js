import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ReviewSection = ({ product, onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Check if current user has already reviewed
  const userReview = product.reviews?.find(review => review.user === user?.id);
  const displayReviews = showAllReviews ? product.reviews : product.reviews?.slice(0, 3);
  
  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews?.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };
  
  const ratingDistribution = getRatingDistribution();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add a review');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (userReview) {
      toast.error('You have already reviewed this product');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/reviews/${product._id}`, { rating, comment });
      toast.success('Review added successfully!');
      setRating(0);
      setComment('');
      onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`text-2xl transition-all duration-300 transform ${
              star <= rating 
                ? 'text-yellow-500 scale-110 drop-shadow-lg' 
                : 'text-gray-300 hover:text-yellow-400 hover:scale-105'
            } ${!readonly ? 'hover:text-yellow-400 cursor-pointer active:scale-95' : 'cursor-default'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="glassmorphism rounded-3xl p-3 shadow-2xl border border-white/30 animate-fade-in-up hover-lift">
      <div className="flex items-center mb-2">
        <div className="bg-gradient-to-r from-sky-400 to-sky-600 p-3 rounded-2xl mr-4 animate-glow">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-sky-600">Customer Reviews</h3>
      </div>
      
      {/* Rating Summary */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-gradient-to-br from-sky-50/80 to-blue-50/80 backdrop-blur-md rounded-3xl p-2 mb-3 border border-white/40 card-hover animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-600 mb-2">{product.rating?.toFixed(1) || '0.0'}</div>
              <StarRating rating={Math.round(product.rating || 0)} readonly />
              <div className="text-sm text-gray-600 mt-2 font-medium">{product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</div>
            </div>
            <div className="flex-1 ml-8">
              {[5, 4, 3, 2, 1].map((star, index) => {
                const count = ratingDistribution[star] || 0;
                const percentage = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center mb-2 animate-slide-left" style={{ animationDelay: `${index * 0.1}s` }}>
                    <span className="text-sm w-4 font-semibold text-gray-700">{star}</span>
                    <span className="text-yellow-500 mx-2 text-lg">★</span>
                    <div className="flex-1 bg-gray-200/60 rounded-full h-3 mx-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-2 mb-3">
        {product.reviews && product.reviews.length > 0 ? (
          <>
            <div className="animate-stagger-children">
              {displayReviews.map((review, index) => (
                <div key={index} className="glassmorphism rounded-2xl p-2 border border-white/30 card-hover mb-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{review.name}</h4>
                        <StarRating rating={review.rating} readonly />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 bg-gray-100/60 px-3 py-1 rounded-full">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <div className="bg-white/40 rounded-xl p-4 mt-4">
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {product.reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="w-full py-3 px-6 bg-gradient-to-r from-sky-500/20 to-sky-600/20 hover:from-sky-500/30 hover:to-sky-600/30 text-sky-700 hover:text-sky-800 font-semibold rounded-2xl transition-all duration-300 border border-sky-200/50 hover:border-sky-300/50 btn-animate"
              >
                {showAllReviews ? '↑ Show Less' : `↓ Show All ${product.reviews.length} Reviews`}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-4 bg-gradient-to-br from-gray-50/80 to-sky-50/40 rounded-3xl border border-gray-200/50">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">No reviews yet</p>
            <p className="text-gray-500 mt-1">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {user ? (
        userReview ? (
          <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 border border-green-200/60 rounded-3xl p-2 animate-bounce-in">
            <div className="flex items-center mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-bold text-green-800 text-lg">Thank you for your review!</h4>
            </div>
            <div className="glassmorphism rounded-2xl p-5 border border-green-200/40">
              <div className="flex items-center justify-between mb-3">
                <StarRating rating={userReview.rating} readonly />
                <span className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userReview.comment && (
                <div className="bg-white/50 rounded-xl p-4 mt-3">
                  <p className="text-gray-700 leading-relaxed">{userReview.comment}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glassmorphism rounded-3xl p-2 border border-white/40 animate-slide-up">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-800 text-lg">Share Your Experience</h4>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating
                </label>
                <div className="bg-white/50 rounded-2xl p-4 border border-white/60">
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Review (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 border border-white/60 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 resize-none bg-white/60 backdrop-blur-sm transition-all duration-300 placeholder-gray-500"
                  placeholder="Share your experience with this product..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl btn-animate animate-glow"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    Submit Review
                  </div>
                )}
              </button>
            </form>
          </div>
        )
      ) : (
        <div className="text-center py-4 bg-gradient-to-br from-gray-50/80 to-sky-50/40 rounded-3xl border border-gray-200/50 animate-fade-in">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2 text-lg font-medium">Please login to add a review</p>
          <p className="text-gray-500 text-sm">Share your experience with other customers</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;