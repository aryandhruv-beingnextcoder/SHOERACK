// Utility functions for handling images across the application

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a blob URL (from file upload), return as is
  if (imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // Get the base URL
  const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
  
  // Database already stores paths with 'uploads/' prefix, so just append to base URL
  return `${API_BASE}/${imagePath}`;
};

export const getPlaceholderImage = (width = 200, height = 200) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F3F4F6"/>
      <path d="M${width/2} ${height/2 + 10}L${width/2 + 15} ${height/2 - 10}L${width/2 + 45} ${height/2 + 20}L${width/2 + 60} ${height/2}L${width/2 + 85} ${height/2 + 30}H${width/2 + 45}H${width/2}H${width/2 - 45}L${width/2 - 85} ${height/2 + 20}L${width/2 - 45} ${height/2 - 10}L${width/2} ${height/2 + 10}Z" fill="#9CA3AF"/>
    </svg>
  `)}`;
};

export const handleImageError = (e, width = 200, height = 200) => {
  e.target.src = getPlaceholderImage(width, height);
};