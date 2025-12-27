export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/300x400?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:5000${imagePath}`;
};
