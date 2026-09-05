export const portfolioPhotos = [
  ['IMG_8058_edited.jpg', 'City rhythm', 'Street'],
  ['IMG_8054_edited.jpg', 'Urban canvas', 'Street'],
  ['IMG_8053_edited.jpg', 'Under northern skies', 'Street'],
  ['IMG_7305_edited.jpg', 'Leeds in gold', 'Street'],
  ['IMG_8107.JPG', 'By the water', 'Portraiture'],
  ['IMG_8109.JPG', 'Summer light', 'Portraiture'],
  ['IMG_7627_edited.jpg', 'Garden portrait', 'Portraiture'],
  ['IMG_7599_edited.jpg', 'Between moments', 'Portraiture'],
  ['IMG_7933.JPG', 'After dark', 'Nightlife'],
  ['IMG_7925.JPG', 'Main character', 'Nightlife'],
  ['IMG_7911.JPG', 'Yellow after midnight', 'Nightlife'],
  ['IMG_7904.JPG', 'Call it a night', 'Nightlife'],
  ['IMG_7721.JPG', 'Good company', 'Gatherings'],
  ['IMG_7720.JPG', 'The whole crew', 'Gatherings'],
  ['IMG_7717.JPG', 'Friends in frame', 'Gatherings'],
  ['IMG_7669.jpg', 'Old friends', 'Gatherings'],
  ['IMG_7743.JPG', 'Soft focus', 'Experiments'],
  ['IMG_7736.jpg', 'Close encounter', 'Experiments'],
].map(([file, title, category], id) => ({ id, title, category, src: `/${encodeURIComponent(file)}` }))

export const imageUrl = (photo) => photo.thumbnail || photo.image || photo.src
