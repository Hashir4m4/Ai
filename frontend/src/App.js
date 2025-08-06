import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Exactly like emergent.sh - AI Agent responses with building capabilities
const AIResponses = {
  projectCreation: (prompt) => ({
    message: `I'll help you build that! Let me create a project structure for your request: "${prompt}"\n\n**🚀 Creating your project...**\n\n**Project Structure:**\n- \`index.html\` - Main HTML file\n- \`app.js\` - Application logic\n- \`styles.css\` - Styling\n- \`package.json\` - Dependencies\n\n**Tech Stack:**\n- Frontend: HTML5, CSS3, JavaScript\n- Framework: ${prompt.toLowerCase().includes('react') ? 'React' : 'Vanilla JS'}\n- Build: Modern ES6+\n\n**Status:** Building your application...\n\n*I'm now setting up the project files and dependencies. This will take a moment.*`,
    shouldBuild: true,
    projectName: prompt.includes('ecommerce') || prompt.includes('shop') ? 'E-commerce Platform' : 
                 prompt.includes('blog') ? 'Blog Platform' : 
                 prompt.includes('portfolio') ? 'Portfolio Website' :
                 prompt.includes('todo') || prompt.includes('task') ? 'Task Manager App' :
                 'Web Application'
  }),
  
  codeGeneration: (request) => ({
    message: `I'll generate that code for you!\n\n\`\`\`javascript\n// ${request}\nconst Component = () => {\n  const [state, setState] = useState('');\n  \n  return (\n    <div className="component">\n      <h2>Generated Component</h2>\n      <input \n        value={state} \n        onChange={(e) => setState(e.target.value)}\n        placeholder="Enter text..."\n      />\n    </div>\n  );\n};\n\nexport default Component;\n\`\`\`\n\n**File created:** \`${request.toLowerCase().replace(/\s+/g, '-')}.js\`\n\nWould you like me to add more functionality or create additional components?`,
    shouldCreateFile: true,
    fileName: `${request.toLowerCase().replace(/\s+/g, '-')}.js`
  }),

  testing: () => ({
    message: `**🧪 Running Tests...**\n\n**Frontend Tests:**\n✅ Component rendering tests passed\n✅ User interaction tests passed\n✅ Responsive design tests passed\n\n**API Tests:**\n✅ Endpoint connectivity tests passed\n✅ Data validation tests passed\n✅ Error handling tests passed\n\n**Performance Tests:**\n✅ Loading time under 2s\n✅ Bundle size optimized\n✅ SEO metrics good\n\n**All tests passed! Your application is ready for deployment.**`
  }),

  deployment: () => ({
    message: `**🚀 Deploying your application...**\n\n**Build Process:**\n✅ Optimizing assets\n✅ Minifying code\n✅ Setting up CDN\n✅ Configuring SSL\n\n**Deployment Status:**\n🟢 **Live at:** https://your-app.sparky-deploy.com\n\n**What's included:**\n- Production-ready build\n- SSL certificate\n- CDN optimization\n- Automatic backups\n\nYour application is now live and ready to use!`
  }),

  helpGuide: () => ({
    message: `**👋 Welcome to Sparky - Your AI Development Assistant!**\n\nI can help you with:\n\n**🚀 Project Creation**\n"Build a React e-commerce site"\n"Create a blog platform with user auth"\n"Make a portfolio website"\n\n**💻 Code Generation**\n"Generate a login component"\n"Create an API endpoint for users"\n"Add a payment form"\n\n**🧪 Testing & Deployment**\n"Test my application"\n"Deploy to production"\n"Run performance tests"\n\n**💡 Quick Start Examples:**\n• "Create a todo app with React"\n• "Build a landing page for a SaaS product"\n• "Generate a dashboard with charts"\n\n**What would you like to build today?**`
  })
};

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: AIResponses.helpGuide().message,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    name: 'E-commerce Platform',
    status: 'building',
    files: [
      { name: 'index.html', type: 'html', size: '2.1 KB', status: 'completed' },
      { name: 'app.js', type: 'javascript', size: '5.7 KB', status: 'building' },
      { name: 'styles.css', type: 'css', size: '3.2 KB', status: 'completed' },
      { name: 'package.json', type: 'json', size: '0.8 KB', status: 'completed' }
    ]
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewMode, setPreviewMode] = useState('preview');
  const [apiKey, setApiKey] = useState(localStorage.getItem('sparky_api_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsBuilding(true);

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsBuilding(false);

      // Handle project creation
      if (response.shouldBuild) {
        setCurrentProject(prev => ({
          ...prev,
          name: response.projectName,
          status: 'building'
        }));

        // Simulate build completion
        setTimeout(() => {
          setCurrentProject(prev => ({
            ...prev,
            status: 'completed'
          }));
        }, 3000);
      }
    }, 2000);
  };

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('create') || lowerInput.includes('build') || lowerInput.includes('make')) {
      return AIResponses.projectCreation(input);
    } else if (lowerInput.includes('component') || lowerInput.includes('code') || lowerInput.includes('generate')) {
      return AIResponses.codeGeneration(input);
    } else if (lowerInput.includes('test') || lowerInput.includes('check')) {
      return AIResponses.testing();
    } else if (lowerInput.includes('deploy') || lowerInput.includes('publish')) {
      return AIResponses.deployment();
    } else if (lowerInput.includes('help') || lowerInput.includes('what') || lowerInput.includes('how')) {
      return AIResponses.helpGuide();
    } else {
      return {
        message: `I understand you want to work on: "${input}"\n\nI can help you build this! Let me create a project structure and generate the necessary code. \n\nWould you like me to:\n• Set up the project files\n• Generate the core components\n• Add styling and functionality\n• Set up testing\n\nJust let me know what specific features you'd like to include!`
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    const content = message.content.split('\n').map((line, index) => {
      // Handle code blocks
      if (line.startsWith('```') && line.endsWith('```')) {
        return (
          <pre key={index} className="code-block">
            <code>{line.slice(3, -3)}</code>
          </pre>
        );
      }
      // Handle inline code
      if (line.includes('`')) {
        const parts = line.split('`');
        return (
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 0 ? part : <code key={i} className="inline-code">{part}</code>
            )}
          </p>
        );
      }
      // Handle headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={index} style={{ display: 'block', marginBottom: '4px' }}>{line.slice(2, -2)}</strong>;
      }
      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        return <li key={index} style={{ marginLeft: '16px' }}>{line.slice(1).trim()}</li>;
      }
      // Handle status indicators
      if (line.includes('✅') || line.includes('🟢') || line.includes('🚀')) {
        return <p key={index} style={{ color: 'var(--success)' }}>{line}</p>;
      }
      
      return line ? <p key={index}>{line}</p> : <br key={index} />;
    });

    return <div>{content}</div>;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon">✨</div>
            <div className="logo-text">Sparky</div>
          </div>
          
          <div className="project-info">
            <div className="project-name">{currentProject.name}</div>
            <div className="project-status">
              <span className={`status-dot ${currentProject.status}`}></span>
              {currentProject.status}
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="header-btn" onClick={() => setShowSettings(true)}>
            Settings
          </button>
          <button className="header-btn">Test</button>
          <button className="header-btn primary">Deploy</button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          {/* Current Project */}
          <div className="sidebar-section">
            <h3>Current Project</h3>
            <div className={`project-card active`}>
              <div className="project-card-header">
                <div className="project-card-title">{currentProject.name}</div>
                <span className={`project-card-status ${currentProject.status}`}>
                  {currentProject.status}
                </span>
              </div>
              <div className="project-card-description">
                Full-stack application with modern tech stack
              </div>
              <div className="project-card-meta">
                <span>{currentProject.files.length} files</span>
                <span>2 mins ago</span>
              </div>
            </div>
          </div>

          {/* File Tree */}
          <div className="sidebar-section">
            <h3>Files</h3>
          </div>
          
          <div className="file-tree">
            {currentProject.files.map((file, index) => (
              <div 
                key={index}
                className={`file-item ${selectedFile === file ? 'active' : ''}`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="file-icon">
                  {file.type === 'html' ? '🌐' : 
                   file.type === 'javascript' ? '⚡' :
                   file.type === 'css' ? '🎨' : '📄'}
                </div>
                <span>{file.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {file.size}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Container */}
        <main className="chat-container">
          <div className="chat-header">
            <div className="chat-title">AI Assistant</div>
            <div className="chat-actions">
              <button className="header-btn">Clear Chat</button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'assistant' ? 'S' : 'U'}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {renderMessage(message)}
                  </div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isBuilding && (
              <div className="message assistant">
                <div className="message-avatar">S</div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span>Building your application...</span>
                      <div className="typing-dots">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                ref={chatInputRef}
                className="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you want to build... (e.g., 'Create a React e-commerce website with user authentication')"
                rows="1"
              />
              <div className="chat-input-actions">
                <button className="input-action-btn">📎</button>
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isBuilding}
                >
                  Send
                </button>
              </div>
            </div>
            
            <div className="suggestions">
              <button 
                className="suggestion-chip"
                onClick={() => setInputValue('Create a React e-commerce website')}
              >
                🛍️ E-commerce Site
              </button>
              <button 
                className="suggestion-chip"
                onClick={() => setInputValue('Build a blog platform with authentication')}
              >
                📝 Blog Platform
              </button>
              <button 
                className="suggestion-chip"
                onClick={() => setInputValue('Generate a todo app with database')}
              >
                ✅ Todo App
              </button>
              <button 
                className="suggestion-chip"
                onClick={() => setInputValue('Test my application')}
              >
                🧪 Run Tests
              </button>
            </div>
          </div>
        </main>

        {/* Preview Panel */}
        <aside className="preview-panel">
          <div className="preview-header">
            <div className="preview-title">
              {selectedFile ? selectedFile.name : 'Preview'}
            </div>
            <button className="header-btn">⚡ Live</button>
          </div>
          
          <div className="preview-tabs">
            <button 
              className={`preview-tab ${previewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setPreviewMode('preview')}
            >
              Preview
            </button>
            <button 
              className={`preview-tab ${previewMode === 'code' ? 'active' : ''}`}
              onClick={() => setPreviewMode('code')}
            >
              Code
            </button>
          </div>
          
          <div className="preview-content">
            {selectedFile ? (
              previewMode === 'preview' ? (
                selectedFile.type === 'html' ? (
                  <iframe 
                    className="preview-iframe"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>${currentProject.name}</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; }
                          .container { max-width: 800px; margin: 0 auto; }
                          .header { background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 2rem; border-radius: 8px; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <div class="header">
                            <h1>${currentProject.name}</h1>
                            <p>Built with Sparky AI</p>
                          </div>
                          <main style="padding: 2rem 0;">
                            <h2>Welcome to your application!</h2>
                            <p>This is a live preview of your ${currentProject.name.toLowerCase()}. The application is fully functional and ready to use.</p>
                            <button style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">Get Started</button>
                          </main>
                        </div>
                      </body>
                      </html>
                    `}
                    title="Application Preview"
                  />
                ) : (
                  <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>
                    <h3>Preview for {selectedFile.name}</h3>
                    <p>File type: {selectedFile.type}</p>
                    <p>Size: {selectedFile.size}</p>
                    <p>Status: {selectedFile.status}</p>
                  </div>
                )
              ) : (
                <textarea 
                  className="code-editor"
                  value={selectedFile.type === 'html' ? 
                    `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${currentProject.name}</title>\n</head>\n<body>\n  <div id="app">\n    <h1>Welcome to ${currentProject.name}</h1>\n  </div>\n</body>\n</html>` :
                    selectedFile.type === 'javascript' ?
                    `// ${selectedFile.name}\nimport React from 'react';\n\nfunction App() {\n  return (\n    <div className="app">\n      <h1>${currentProject.name}</h1>\n      <p>Your application is ready!</p>\n    </div>\n  );\n}\n\nexport default App;` :
                    `/* ${selectedFile.name} */\n.app {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}\n\n.header {\n  background: linear-gradient(135deg, #3b82f6, #1e40af);\n  color: white;\n  padding: 2rem;\n  border-radius: 8px;\n}`
                  }
                  onChange={() => {}}
                  readOnly
                />
              )
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h3>Select a file to preview</h3>
                <p>Choose a file from the sidebar to see its contents and live preview.</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="modal"
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid var(--border-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Settings</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
              <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                Your API key is stored locally and never shared.
              </small>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '10px 20px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('sparky_api_key', apiKey);
                  setShowSettings(false);
                }}
                style={{
                  padding: '10px 20px',
                  background: 'var(--accent-primary)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;