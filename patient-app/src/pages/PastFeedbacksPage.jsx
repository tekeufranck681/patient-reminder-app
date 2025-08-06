import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useToast } from '../contexts/ToastContext';
import { useFeedbackStore } from '../stores/feedbackStore';
import { 
  Search,
  Filter,
  Star,
  MessageSquare,
  Mic,
  Calendar,
  RefreshCw,
  ChevronDown,
  SortAsc,
  SortDesc,
  Send
} from 'lucide-react';
import SEO from '../components/SEO';

const PastFeedbacksPage = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { 
    feedbacks, 
    isFetching, 
    isResending, 
    error, 
    fetchMyFeedbacks, 
    resendFeedback,
    clearError 
  } = useFeedbackStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rating: 'all',
    type: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMyFeedbacks().catch(error => {
      addToast(error.message || t('errorFetchingFeedbacks'), 'error');
    });
  }, [fetchMyFeedbacks, addToast, t]);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
      clearError();
    }
  }, [error, addToast, clearError]);

  const handleResend = async (feedbackId) => {
    try {
      await resendFeedback(feedbackId);
      addToast(t('feedbackResent'), 'success');
    } catch (error) {
      addToast(error.message || t('errorResendingFeedback'), 'error');
    }
  };

  const getDateRange = (date) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const diffTime = Math.abs(now - feedbackDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'recent';
    if (diffDays <= 7) return 'week';
    if (diffDays <= 30) return 'month';
    return 'older';
  };

  const getFeedbackType = (feedback) => {
    const hasText = feedback.text && feedback.text.trim();
    const hasVoice = feedback.voice_message_url || feedback.voice_text;
    const hasEmoji = feedback.emoji;
    const hasRating = feedback.star_rating > 0;

    if (hasText && hasVoice) return 'text-voice';
    if (hasText) return 'text';
    if (hasVoice) return 'voice';
    if (hasEmoji && hasRating) return 'emoji-rating';
    if (hasEmoji) return 'emoji';
    if (hasRating) return 'rating';
    return 'other';
  };

  const filteredAndSortedFeedbacks = useMemo(() => {
    let filtered = feedbacks.filter(feedback => {
      // Search filter
      const searchMatch = !searchTerm || 
        (feedback.text && feedback.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feedback.voice_text && feedback.voice_text.toLowerCase().includes(searchTerm.toLowerCase()));

      // Rating filter
      const ratingMatch = filters.rating === 'all' || 
        feedback.star_rating === parseInt(filters.rating);

      // Type filter
      const typeMatch = filters.type === 'all' || 
        getFeedbackType(feedback) === filters.type ||
        (filters.type === 'text' && feedback.text) ||
        (filters.type === 'voice' && (feedback.voice_message_url || feedback.voice_text)) ||
        (filters.type === 'emoji' && feedback.emoji);

      // Date range filter
      const dateMatch = filters.dateRange === 'all' || 
        getDateRange(feedback.created_at) === filters.dateRange;

      return searchMatch && ratingMatch && typeMatch && dateMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'highest':
          return b.star_rating - a.star_rating;
        case 'lowest':
          return a.star_rating - b.star_rating;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return filtered;
  }, [feedbacks, searchTerm, filters, sortBy]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('locale'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Past Feedbacks - EcoHealth",
    "description": "View and manage your previously submitted healthcare feedback",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": feedbacks.length
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">{t('loadingFeedbacks')}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={t('pastFeedbacks')}
        description="View and manage your previously submitted healthcare feedback and reviews"
        keywords="past feedback, feedback history, healthcare reviews, patient feedback management"
        structuredData={structuredData}
      />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('pastFeedbacks')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('pastFeedbacksDescription')}
          </p>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchFeedbacks')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{t('filters')}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredAndSortedFeedbacks.length} {t('feedbacksFound')}
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="oldest">{t('sortOldest')}</option>
                <option value="highest">{t('sortHighestRated')}</option>
                <option value="lowest">{t('sortLowestRated')}</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('filterByRating')}
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">{t('allRatings')}</option>
                      <option value="5">5 {t('stars')}</option>
                      <option value="4">4 {t('stars')}</option>
                      <option value="3">3 {t('stars')}</option>
                      <option value="2">2 {t('stars')}</option>
                      <option value="1">1 {t('star')}</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('filterByType')}
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">{t('allTypes')}</option>
                      <option value="text">{t('textFeedback')}</option>
                      <option value="voice">{t('voiceFeedback')}</option>
                      <option value="emoji">{t('emojiFeedback')}</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('filterByDate')}
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">{t('allDates')}</option>
                      <option value="recent">{t('today')}</option>
                      <option value="week">{t('thisWeek')}</option>
                      <option value="month">{t('thisMonth')}</option>
                      <option value="older">{t('older')}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feedbacks List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAndSortedFeedbacks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('noFeedbacksFound')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || filters.rating !== 'all' || filters.type !== 'all' || filters.dateRange !== 'all'
                    ? t('tryAdjustingFilters')
                    : t('noFeedbacksYet')
                  }
                </p>
              </motion.div>
            ) : (
              filteredAndSortedFeedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Rating */}
                      {feedback.star_rating > 0 && (
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.star_rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            {feedback.star_rating}/5
                          </span>
                        </div>
                      )}

                      {/* Emoji */}
                      {feedback.emoji && (
                        <span className="text-2xl">{feedback.emoji}</span>
                      )}

                      {/* Type Indicators */}
                      <div className="flex items-center space-x-2">
                        {feedback.text && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <MessageSquare className="h-3 w-3" />
                            <span>{t('text')}</span>
                          </div>
                        )}
                        {(feedback.voice_message_url || feedback.voice_text) && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Mic className="h-3 w-3" />
                            <span>{t('voice')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(feedback.created_at)}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleResend(feedback.id)}
                        disabled={isResending}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                      >
                        {isResending ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span>{t('resendFeedback')}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Feedback Content */}
                  {feedback.text && (
                    <div className="mb-3">
                      <p className="text-gray-900 dark:text-white leading-relaxed">
                        {feedback.text}
                      </p>
                    </div>
                  )}

                  {feedback.voice_text && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mic className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('voiceTranscription')}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                        {feedback.voice_text}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PastFeedbacksPage;