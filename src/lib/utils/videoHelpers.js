/**
 * Convert YouTube URL to embed format with autoplay parameters
 * @param {string} url - YouTube video URL
 * @returns {string} - Embed URL
 */
export const getYouTubeEmbedUrl = (url) => {
  // Handle YouTube Shorts
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.split("shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
  }
  // Handle regular YouTube videos
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
  }
  // Handle youtu.be links
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
  }
  // Return original URL for non-YouTube videos
  return url;
};

/**
 * Truncate address for display
 * @param {string} address - Address to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated address
 */
export const truncateAddress = (address, maxLength = 40) => {
  if (!address) return "";
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + "...";
};
