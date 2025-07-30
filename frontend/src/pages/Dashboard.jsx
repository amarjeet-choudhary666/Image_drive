import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FolderView from '../components/FolderView';
import ImageUpload from '../components/ImageUpload';
import SearchBar from '../components/SearchBar';

function Dashboard({ user, setUser }) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  const fetchFolders = async (parentId = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = parentId 
        ? `http://localhost:3000/api/v1/folders/parent/${parentId}`
        : 'http://localhost:3000/api/v1/folders/parent/null';
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(data.data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (folderId) => {
    if (!folderId) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/api/v1/images/folder/${folderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchFolders(currentFolder);
    if (currentFolder) {
      fetchImages(currentFolder);
    } else {
      setImages([]);
    }
  }, [currentFolder]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:3000/api/v1/images/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching images:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchQuery('');
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">My Drive</h1>
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={handleSearch} isSearching={isSearching} />
              <button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Upload Image
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar 
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          onRefresh={() => fetchFolders(currentFolder)}
        />

        <main className="flex-1 p-6">
            {searchQuery && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  {isSearching ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                      <span className="text-blue-800">Searching for "{searchQuery}"...</span>
                    </div>
                  ) : searchResults ? (
                    <span className="text-blue-800">
                      Found {searchResults.length} image{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </span>
                  ) : (
                    <span className="text-blue-800">No images found for "{searchQuery}"</span>
                  )}
                </div>
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <FolderView
              folders={folders}
              images={searchResults || images}
              currentFolder={currentFolder}
              setCurrentFolder={setCurrentFolder}
              onRefresh={() => {
                fetchFolders(currentFolder);
                if (currentFolder) fetchImages(currentFolder);
              }}
              isSearchResult={!!searchResults}
              onClearSearch={clearSearch}
            />
          )}
        </main>
      </div>

      {showUpload && (
        <ImageUpload
          currentFolder={currentFolder}
          onClose={() => setShowUpload(false)}
          onUploadSuccess={() => {
            setShowUpload(false);
            if (currentFolder) fetchImages(currentFolder);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;