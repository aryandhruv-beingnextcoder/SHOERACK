const path = require('path');
const fs = require('fs').promises;

const CATEGORIES = {
  FORMAL: 'formal',
  SNEAKERS: 'sneakers', 
  SPORTS: 'sports',
  CASUAL: 'casual'
};

const createCategoryFolders = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  for (const category of Object.values(CATEGORIES)) {
    const categoryDir = path.join(uploadsDir, category);
    try {
      await fs.mkdir(categoryDir, { recursive: true });
    } catch (error) {
      console.error(`Error creating ${category} folder:`, error);
    }
  }
};

const getPhotosByCategory = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const categorizedPhotos = {};

  for (const category of Object.values(CATEGORIES)) {
    const categoryDir = path.join(uploadsDir, category);
    try {
      const files = await fs.readdir(categoryDir);
      categorizedPhotos[category] = files.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );
    } catch (error) {
      categorizedPhotos[category] = [];
    }
  }

  return categorizedPhotos;
};

const movePhotoToCategory = async (filename, category) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const sourcePath = path.join(uploadsDir, filename);
  const targetPath = path.join(uploadsDir, category, filename);

  try {
    await fs.rename(sourcePath, targetPath);
    return `uploads/${category}/${filename}`;
  } catch (error) {
    throw new Error(`Failed to move photo to ${category}: ${error.message}`);
  }
};

module.exports = {
  CATEGORIES,
  createCategoryFolders,
  getPhotosByCategory,
  movePhotoToCategory
};