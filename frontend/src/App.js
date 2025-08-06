import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Components from './Components';

const { 
  Sidebar, 
  ChatInterface, 
  ProjectDashboard, 
  FileExplorer, 
  PreviewPanel, 
  SettingsModal, 
  Header 
} = Components;

function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('sparky_api_key') || '');
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'Sample E-commerce App',
      description: 'A full-stack e-commerce application with React and Node.js',
      status: 'completed',
      createdAt: '2025-01-15',
      files: [
        { name: 'App.js', type: 'javascript', content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div className="app">\n      <h1>E-commerce App</h1>\n    </div>\n  );\n}\n\nexport default App;' },
        { name: 'styles.css', type: 'css', content: '.app {\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}' }
      ]
    },
    {
      id: '2', 
      name: 'Landing Page Builder',
      description: 'A responsive landing page with modern design',
      status: 'in-progress',
      createdAt: '2025-01-20',
      files: [
        { name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Landing Page</title>\n</head>\n<body>\n  <header>Landing Page</header>\n</body>\n</html>' }
      ]
    }
  ]);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('sparky_api_key', apiKey);
    }
  }, [apiKey]);

  const handleCreateProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      status: 'in-progress',
      createdAt: new Date().toISOString().split('T')[0],
      files: []
    };
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
  };

  const handleUpdateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    ));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => ({ ...prev, ...updates }));
    }
  };

  const handleFileCreate = (fileName, fileType, content) => {
    const newFile = { name: fileName, type: fileType, content };
    const updatedFiles = [...(selectedProject?.files || []), newFile];
    handleUpdateProject(selectedProject.id, { files: updatedFiles });
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
          
          <main className="main-content">
            <Header 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setShowSettings={setShowSettings}
              selectedProject={selectedProject}
            />
            
            <div className="content-area">
              {currentView === 'chat' && (
                <ChatInterface 
                  darkMode={darkMode}
                  apiKey={apiKey}
                  onCreateProject={handleCreateProject}
                  onUpdateProject={handleUpdateProject}
                  selectedProject={selectedProject}
                  onFileCreate={handleFileCreate}
                />
              )}
              
              {currentView === 'projects' && (
                <ProjectDashboard 
                  projects={projects}
                  onProjectSelect={setSelectedProject}
                  onProjectCreate={handleCreateProject}
                  darkMode={darkMode}
                />
              )}
              
              {currentView === 'files' && selectedProject && (
                <div className="files-and-preview">
                  <FileExplorer 
                    project={selectedProject}
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                    darkMode={darkMode}
                  />
                  <PreviewPanel 
                    file={selectedFile}
                    project={selectedProject}
                    darkMode={darkMode}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
        
        {showSettings && (
          <SettingsModal 
            show={showSettings}
            onClose={() => setShowSettings(false)}
            apiKey={apiKey}
            setApiKey={setApiKey}
            darkMode={darkMode}
          />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;