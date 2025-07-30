import { useState } from 'react';

function Sidebar({ currentFolder, setCurrentFolder, onRefresh }) {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const createFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/api/v1/folders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          name: folderName,
          parentId: currentFolder
        }),
      });

      if (response.ok) {
        setFolderName('');
        setShowCreateFolder(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-4">
        <div className="space-y-2">
          <button
            onClick={() => setCurrentFolder(null)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              currentFolder === null
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📁 My Drive
          </button>

          <button
            onClick={() => setShowCreateFolder(true)}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ➕ New Folder
          </button>
        </div>

        {currentFolder && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Current Location:</p>
            <button
              onClick={() => setCurrentFolder(null)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              📁 Back to Root
            </button>
          </div>
        )}
      </div>

      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4">Create New Folder</h3>
            <form onSubmit={createFolder}>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setFolderName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;