import React, { useState, useRef, useEffect } from 'react';

const Sidebar = ({ currentView, setCurrentView, darkMode, projects, selectedProject, setSelectedProject }) => {
  const menuItems = [
    { id: 'chat', icon: '💬', label: 'AI Chat', description: 'Build with AI agents' },
    { id: 'projects', icon: '📁', label: 'Projects', description: 'Manage your projects' },
    { id: 'files', icon: '📄', label: 'Files', description: 'Browse project files' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Sparky</span>
        </div>
        <p className="logo-subtitle">AI Agent Platform</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              <span className="nav-description">{item.description}</span>
            </div>
          </button>
        ))}
      </nav>

      {selectedProject && (
        <div className="current-project">
          <h4>Current Project</h4>
          <div className="project-card mini">
            <h5>{selectedProject.name}</h5>
            <p>{selectedProject.description}</p>
            <span className={`status ${selectedProject.status}`}>{selectedProject.status}</span>
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        <div className="project-count">
          {projects.length} Projects Created
        </div>
      </div>
    </div>
  );
};

const Header = ({ darkMode, setDarkMode, setShowSettings, selectedProject }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h2>
          {selectedProject ? selectedProject.name : 'Welcome to Sparky'}
        </h2>
        {selectedProject && (
          <span className={`project-status ${selectedProject.status}`}>
            {selectedProject.status}
          </span>
        )}
      </div>
      
      <div className="header-right">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle"
          title="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className="settings-btn"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};

const ChatInterface = ({ darkMode, apiKey, onCreateProject, onUpdateProject, selectedProject, onFileCreate }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m Sparky, your AI development assistant. I can help you build web applications, create code, and manage projects. What would you like to build today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const responses = {
      project: {
        content: `I'll help you create a new project! Based on your request, I'm setting up a project structure. Here's what I'm creating:

**Project: ${userMessage.includes('ecommerce') ? 'E-commerce Platform' : userMessage.includes('blog') ? 'Blog Application' : 'Web Application'}**

Files created:
- \`index.html\` - Main HTML structure
- \`app.js\` - Application logic  
- \`styles.css\` - Styling
- \`README.md\` - Project documentation

Would you like me to add any specific features or components?`,
        shouldCreateProject: true,
        projectData: {
          name: userMessage.includes('ecommerce') ? 'E-commerce Platform' : userMessage.includes('blog') ? 'Blog Application' : 'Web Application',
          description: `Generated from: "${userMessage}"`,
        }
      },
      code: {
        content: `Here's the code you requested:

\`\`\`javascript
// React component example
import React, { useState } from 'react';

const MyComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="component">
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default MyComponent;
\`\`\`

This creates a simple React counter component. Would you like me to add more features or create additional files?`,
        shouldCreateFile: true,
        fileData: {
          name: 'Counter.js',
          type: 'javascript',
          content: `import React, { useState } from 'react';\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="component">\n      <h2>Counter: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n};\n\nexport default Counter;`
        }
      },
      help: {
        content: `I can help you with various tasks:

🚀 **Project Creation**: "Create a new ecommerce website" or "Build a blog application"
💻 **Code Generation**: "Generate a React component" or "Create a CSS layout"  
📁 **File Management**: "Add a new JavaScript file" or "Create a database schema"
🧪 **Testing**: "Write unit tests" or "Create API tests"
⚡ **Integration**: "Add authentication" or "Connect to a database"

Try asking me something like:
- "Create a todo list app"
- "Generate a login form component" 
- "Add API integration for user management"

What would you like to work on?`
      },
      default: {
        content: `I understand you want to work on: "${userMessage}"

I can help you build this! Here's what I suggest:

1. **Project Structure**: I'll set up the basic file structure
2. **Core Components**: Create the main components and logic
3. **Styling**: Add modern, responsive CSS
4. **Functionality**: Implement the core features
5. **Testing**: Add tests to ensure everything works

Would you like me to start by creating a new project for this, or should we add this to your existing project?`
      }
    };

    const userLower = userMessage.toLowerCase();
    if (userLower.includes('create') && (userLower.includes('project') || userLower.includes('app') || userLower.includes('website'))) {
      return responses.project;
    } else if (userLower.includes('code') || userLower.includes('component') || userLower.includes('function')) {
      return responses.code;
    } else if (userLower.includes('help') || userLower.includes('what') || userLower.includes('how')) {
      return responses.help;
    } else {
      return responses.default;
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user', 
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = simulateAIResponse(inputValue);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Handle project creation
      if (response.shouldCreateProject) {
        onCreateProject(response.projectData);
      }

      // Handle file creation
      if (response.shouldCreateFile && selectedProject) {
        onFileCreate(response.fileData.name, response.fileData.type, response.fileData.content);
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'assistant' ? '✨' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.content.split('\n').map((line, index) => {
                  if (line.startsWith('```') && line.endsWith('```')) {
                    return (
                      <pre key={index} className="code-block">
                        <code>{line.slice(3, -3)}</code>
                      </pre>
                    );
                  } else if (line.includes('```')) {
                    if (line.startsWith('```')) {
                      return <pre key={index} className="code-block"><code>{line.slice(3)}</code></pre>;
                    } else if (line.endsWith('```')) {
                      return <pre key={index} className="code-block"><code>{line.slice(0, -3)}</code></pre>;
                    }
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <strong key={index}>{line.slice(2, -2)}</strong>;
                  } else if (line.startsWith('`') && line.endsWith('`')) {
                    return <code key={index} className="inline-code">{line.slice(1, -1)}</code>;
                  }
                  return <p key={index}>{line}</p>;
                })}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message assistant">
            <div className="message-avatar">✨</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build... (e.g., 'Create a todo app with React')"
            rows="3"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="send-button"
          >
            <span>Send</span>
            <span className="send-icon">➤</span>
          </button>
        </div>
        
        <div className="input-suggestions">
          <button onClick={() => setInputValue('Create a React e-commerce website')}>
            🛍️ E-commerce App
          </button>
          <button onClick={() => setInputValue('Build a blog platform with user authentication')}>
            📝 Blog Platform  
          </button>
          <button onClick={() => setInputValue('Generate a todo list component')}>
            ✅ Todo App
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectDashboard = ({ projects, onProjectSelect, onProjectCreate, darkMode }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onProjectCreate({
        name: newProjectName,
        description: newProjectDescription
      });
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="project-dashboard">
      <div className="dashboard-header">
        <h2>Your Projects</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="create-project-btn"
        >
          ✨ New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card" onClick={() => onProjectSelect(project)}>
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status ${project.status}`}>{project.status}</span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span className="file-count">{project.files?.length || 0} files</span>
              <span className="created-date">Created {project.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Project</h3>
              <button onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <textarea
                placeholder="Project description (optional)"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows="3"
              />
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button onClick={handleCreateProject}>Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileExplorer = ({ project, onFileSelect, selectedFile, darkMode }) => {
  const getFileIcon = (fileType) => {
    const icons = {
      javascript: '📄',
      css: '🎨',
      html: '🌐',
      json: '📋',
      md: '📝',
      default: '📄'
    };
    return icons[fileType] || icons.default;
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>📁 {project.name}</h3>
        <span className="file-count">{project.files?.length || 0} files</span>
      </div>
      
      <div className="file-list">
        {project.files?.length > 0 ? (
          project.files.map((file, index) => (
            <div 
              key={index}
              className={`file-item ${selectedFile === file ? 'selected' : ''}`}
              onClick={() => onFileSelect(file)}
            >
              <span className="file-icon">{getFileIcon(file.type)}</span>
              <span className="file-name">{file.name}</span>
              <span className="file-type">{file.type}</span>
            </div>
          ))
        ) : (
          <div className="no-files">
            <p>No files yet. Use the AI chat to generate code!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PreviewPanel = ({ file, project, darkMode }) => {
  if (!file) {
    return (
      <div className="preview-panel">
        <div className="preview-placeholder">
          <h3>Select a file to preview</h3>
          <p>Choose a file from the project explorer to see its contents and preview.</p>
        </div>
      </div>
    );
  }

  const renderPreview = () => {
    if (file.type === 'html') {
      return (
        <div className="html-preview">
          <iframe
            srcDoc={file.content}
            title="HTML Preview"
            style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
          />
        </div>
      );
    } else {
      return (
        <pre className="code-preview">
          <code>{file.content}</code>
        </pre>
      );
    }
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>🔍 {file.name}</h3>
        <span className="file-type-badge">{file.type}</span>
      </div>
      
      <div className="preview-tabs">
        <button className="tab active">Preview</button>
        <button className="tab">Edit</button>
      </div>
      
      <div className="preview-content">
        {renderPreview()}
      </div>
    </div>
  );
};

const SettingsModal = ({ show, onClose, apiKey, setApiKey, darkMode }) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(tempApiKey);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal settings-modal">
        <div className="modal-header">
          <h3>⚙️ Settings</h3>
          <button onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="setting-section">
            <h4>AI Configuration</h4>
            <div className="setting-item">
              <label htmlFor="apiKey">API Key</label>
              <input
                id="apiKey"
                type="password"
                placeholder="Enter your OpenAI API key..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <small>Your API key is stored locally and never shared.</small>
            </div>
          </div>

          <div className="setting-section">
            <h4>Platform Info</h4>
            <div className="info-grid">
              <div className="info-item">
                <strong>Version</strong>
                <span>1.0.0</span>
              </div>
              <div className="info-item">
                <strong>Theme</strong>
                <span>{darkMode ? 'Dark' : 'Light'}</span>
              </div>
              <div className="info-item">
                <strong>Status</strong>
                <span className="status-online">Online</span>
              </div>
            </div>
          </div>

          <div className="setting-section">
            <h4>About Sparky</h4>
            <p>Sparky is an AI-powered development platform that helps you build applications through conversational AI. No login required - just start building!</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} className="primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default { 
  Sidebar, 
  ChatInterface, 
  ProjectDashboard, 
  FileExplorer, 
  PreviewPanel, 
  SettingsModal, 
  Header 
};