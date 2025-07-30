import { useState, useEffect } from 'react';

function ImageViewer({ image, images, currentIndex, onClose, onDelete, onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const currentImage = images[currentImageIndex];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentImageIndex]);

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      onNavigate(newIndex);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      onNavigate(newIndex);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/api/v1/images/${currentImage._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        onDelete();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.imageUrl;
    link.download = currentImage.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 flex justify-between items-center z-10">
        <div>
          <h3 className="text-lg font-medium">{currentImage.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            {currentImage.folder && (
              <span>in: {currentImage.folder.name}</span>
            )}
            <span>{currentImageIndex + 1} of {images.length}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Download
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>
      </div>

      {currentImageIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentImageIndex < images.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="max-w-full max-h-full p-16">
        <img
          src={currentImage.imageUrl}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
        Use arrow keys or click arrows to navigate • ESC to close
      </div>

      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}

export default ImageViewer;