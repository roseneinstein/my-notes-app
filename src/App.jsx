import { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [docs, setDocs] = useState({
    1: [],
    2: [],
    3: [],
  });
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState([
    { id: 1, name: "Work Documents", folderPath: "work" },
    { id: 2, name: "Personal Notes", folderPath: "personal" },
    { id: 3, name: "Study Material", folderPath: "study" },
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  useEffect(() => {
    const fetchFiles = async () => {
      const organized = { 1: [], 2: [], 3: [] };
      for (const folder of folders) {
        const { data, error } = await supabase.storage
          .from("my-docs")
          .list(folder.folderPath, { limit: 100 });
        if (!error && data) organized[folder.id] = data.map((f) => f.name);
      }
      setDocs(organized);
    };
    fetchFiles();
  }, [folders]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedFolder) return;
    const folder = folders.find((f) => f.id === selectedFolder);
    setUploading(true);
    const filePath = `${folder.folderPath}/${file.name}`;
    const { error } = await supabase.storage.from("my-docs").upload(filePath, file);
    setUploading(false);
    if (error) alert("❌ Upload failed: " + error.message);
    else {
      alert("✅ File uploaded successfully!");
      setDocs((prev) => ({
        ...prev,
        [selectedFolder]: [...prev[selectedFolder], file.name],
      }));
    }
  };

  const handlePreview = async (fileName) => {
    const folder = folders.find((f) => f.id === selectedFolder);
    const { data } = await supabase.storage
      .from("my-docs")
      .getPublicUrl(`${folder.folderPath}/${fileName}`);
    window.open(data.publicUrl, "_blank");
  };

  const handleDelete = async (fileName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${fileName}"?`);
    if (!confirmDelete) return;
    const folder = folders.find((f) => f.id === selectedFolder);
    const filePath = `${folder.folderPath}/${fileName}`;
    const { error } = await supabase.storage.from("my-docs").remove([filePath]);
    if (error) alert("❌ Delete failed: " + error.message);
    else {
      alert("🗑️ File deleted successfully!");
      setDocs((prev) => ({
        ...prev,
        [selectedFolder]: prev[selectedFolder].filter((f) => f !== fileName),
      }));
    }
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter new folder name:");
    if (!name) return;
    const newId = folders.length + 1;
    const newFolder = { id: newId, name, folderPath: name.toLowerCase().replace(/\s+/g, "-") };
    setFolders([...folders, newFolder]);
    alert(`📁 Folder "${name}" created!`);
  };

  const handleDeleteFolder = (id) => {
    const confirmDelete = window.confirm("Delete this folder? All files inside will remain in Supabase.");
    if (!confirmDelete) return;
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs =
    selectedFolder && docs[selectedFolder]
      ? docs[selectedFolder].filter((doc) =>
          doc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  return (
    <div className={`app-container fade-in`}>
      {/* 🌗 Light/Dark Toggle */}
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞" : "🌙"}
      </button>

      {/* 🏠 Home Button */}
      <button
        className="home-btn"
        onClick={() => {
          setSelectedFolder(null);
          setSearchQuery("");
        }}
        title="Go to Home"
      >
        🏠
      </button>

      {!selectedFolder ? (
        <>
          <h1>My Notes App</h1>
          <p>Select a folder to view documents</p>

          {/* 🗂️ Create Folder + Search Bar */}
          <div className="top-controls">
            <button className="create-folder-btn" onClick={handleCreateFolder}>
              ➕ Create Folder
            </button>

            <input
              type="text"
              placeholder="Search folders..."
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* ⋮ Folder Delete Menu */}
            <div className="menu-container">
              <button className="menu-dots" onClick={() => setShowMenu(!showMenu)}>
                ⋮
              </button>
              {showMenu && (
                <div className="menu-dropdown">
                  {folders.map((f) => (
                    <button key={f.id} onClick={() => handleDeleteFolder(f.id)}>
                      🗑️ Delete {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="folder-list">
            {filteredFolders.length > 0 ? (
              filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="folder-card fade-in"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  📁 {folder.name}
                </div>
              ))
            ) : (
              <p className="no-results">No matching folders found.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="breadcrumb">
            📁 Current Folder:{" "}
            <strong>{folders.find((f) => f.id === selectedFolder)?.name}</strong>
          </div>

          {/* 🔍 Search Bar for Docs */}
          <input
            type="text"
            placeholder="Search documents..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ul className="doc-list">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc, i) => (
                <li key={i} className="fade-in">
                  <span className="doc-name">📄 {doc}</span>
                  <div className="doc-actions">
                    <button className="preview-btn" onClick={() => handlePreview(doc)}>
                      👁️ Preview
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(doc)}>
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-results">No matching documents found.</p>
            )}
          </ul>

          <input
            type="file"
            id="fileInput"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            accept="*/*"

          />

          <button
            className="upload-btn"
            onClick={() => document.getElementById("fileInput").click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "➕ Upload Document"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
