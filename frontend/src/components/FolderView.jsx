import { useState } from 'react';
import ImageViewer from './ImageViewer';

function FolderView({ 
  folders, 
  images, 
  currentFolder, 
  setCurrentFolder, 
  onRefresh, 
  isSearchResult, 
  onClearSearch 
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const deleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/api/v1/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const deleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/api/v1/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div>
      {isSearchResult && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-blue-800">
              Search Results ({images.length} images found)
            </p>
            <button
              onClick={onClearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {!isSearchResult && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentFolder ? 'Folder Contents' : 'My Drive'}
          </h2>

          {folders.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Folders</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    className="group relative bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div
                      onClick={() => setCurrentFolder(folder._id)}
                      className="text-center"
                    >
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {folder.name}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder._id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            {isSearchResult ? 'Images' : 'Images in this folder'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image._id}
                className="group relative bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div 
                  className="aspect-square overflow-hidden rounded-t-lg"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div 
                  className="p-3"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.name}
                  </p>
                  {isSearchResult && image.folder && (
                    <p className="text-xs text-gray-500 truncate">
                      in: {image.folder.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImage(image._id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow-sm transition-opacity"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearchResult && folders.length === 0 && images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentFolder ? 'This folder is empty' : 'Your drive is empty'}
          </h3>
          <p className="text-gray-500">
            {currentFolder 
              ? 'Upload some images or create folders to get started'
              : 'Create your first folder or upload images to get started'
            }
          </p>
        </div>
      )}

      {isSearchResult && images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No images found
          </h3>
          <p className="text-gray-500">
            Try searching with different keywords
          </p>
        </div>
      )}

      {selectedImageIndex !== null && (
        <ImageViewer
          image={images[selectedImageIndex]}
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onDelete={() => {
            setSelectedImageIndex(null);
            onRefresh();
          }}
          onNavigate={(newIndex) => setSelectedImageIndex(newIndex)}
        />
      )}
    </div>
  );
}

export default FolderView;