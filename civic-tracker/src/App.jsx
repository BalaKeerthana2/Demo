import { useState, useRef } from 'react';
import { Building, Plus, MapPin, ChevronUp, Camera, CheckCircle, BellRing, Trophy, AlertTriangle, User, Mail, Phone, Tag } from 'lucide-react';
import './index.css';

const initialIssues = [
    {
        id: 1,
        title: 'Deep Pothole on S.V. Road',
        category: 'infrastructure',
        location: 'S.V. Road, Andheri West, Mumbai',
        description: 'Large pothole causing severe traffic jams and damage to autos. Needs immediate attention before monsoon.',
        status: 'pending',
        votes: 124,
        image: '/pothole_india.png',
        timestamp: '2 hours ago',
        voted: false
    },
    {
        id: 2,
        title: 'Broken Streetlight',
        category: 'utilities',
        location: '100 Feet Road, Indiranagar, Bangalore',
        description: 'Streetlight has been out for a week, making the crossing dangerous at night for pedestrians.',
        status: 'progress',
        votes: 89,
        image: '/streetlight_india.png',
        timestamp: '1 day ago',
        voted: true
    },
    {
        id: 3,
        title: 'Illegal Dumping on Sidewalk',
        category: 'sanitation',
        location: 'Connaught Place, Block A, New Delhi',
        description: 'Commercial garbage and debris dumped illegally right on the walking path.',
        status: 'resolved',
        votes: 212,
        image: '/dumping_india.png',
        timestamp: '3 days ago',
        voted: false
    }
];

const topContributors = [
  { name: 'Sarah Jenkins', pts: 450, initial: 'S' },
  { name: 'Marcus Doe', pts: 380, initial: 'M' },
  { name: 'Elena R.', pts: 290, initial: 'E' },
];

function AnimatedBackground() {
  return (
    <div className="animated-bg"></div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [issues, setIssues] = useState(initialIssues);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Controlled Inputs for Real-time validation
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const toggleVote = (id) => {
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          votes: issue.voted ? issue.votes - 1 : issue.votes + 1,
          voted: !issue.voted
        };
      }
      return issue;
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const handleNameChange = (e) => {
    // Only allow letters and spaces
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setFormName(val);
  };

  const handlePhoneChange = (e) => {
    // Only allow numbers
    let val = e.target.value.replace(/\D/g, '');
    // Limit to exactly 10 digits
    if (val.length > 10) val = val.slice(0, 10);
    setFormPhone(val);
  };

  const validateForm = (formData) => {
    const newErrors = {};
    
    if (!previewImage) newErrors.image = "Photo evidence is strictly required.";
    
    if (!formName || formName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }
    
    const email = formData.get('email');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "A valid email address is required.";
    }
    
    if (formPhone && formPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits if provided.";
    }
    
    const category = formData.get('category');
    if (!category) newErrors.category = "Please select an issue category.";
    
    const severity = formData.get('severity');
    if (!severity) newErrors.severity = "Please select a severity level.";
    
    const location = formData.get('location');
    if (!location || location.trim().length < 5) {
      newErrors.location = "Please provide a more detailed location (min 5 chars).";
    }
    
    const description = formData.get('description');
    if (!description || description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    if (!validateForm(formData)) {
      return; 
    }
    
    const categoryValue = formData.get('category');
    const categoryText = e.target.querySelector(`select[name="category"] option[value="${categoryValue}"]`).text;

    const newIssue = {
      id: issues.length + 1,
      title: categoryText.split(' ')[0] + ' Issue',
      category: categoryValue,
      location: formData.get('location'),
      description: formData.get('description'),
      status: 'pending',
      votes: 1,
      image: previewImage,
      timestamp: 'Just now',
      voted: true
    };

    setIssues([newIssue, ...issues]);
    setShowModal(true);
    e.target.reset();
    setPreviewImage(null);
    setErrors({});
    setFormName('');
    setFormPhone('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFilterCategory('all');
    setActiveTab('feed');
  };

  const filteredIssues = filterCategory === 'all' 
    ? issues 
    : issues.filter(i => i.category === filterCategory);

  return (
    <>
      <AnimatedBackground />
      
      <nav className="navbar">
        <div className="nav-brand">
          <Building size={24} strokeWidth={2.5} />
          <span>CivicConnect</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              setActiveTab('report');
              setErrors({});
            }}
          >
            <Plus size={18} strokeWidth={2.5} /> Report Issue
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="main-content">
          {activeTab === 'feed' && (
            <section className="view-section active">
              <div className="view-header">
                <div>
                  <h1>Community <span>Issues</span></h1>
                  <p className="subtitle">Track and vote on issues reported in your area.</p>
                </div>
                <div className="filters">
                  <select 
                    className="filter-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="sanitation">Sanitation</option>
                    <option value="utilities">Utilities</option>
                    <option value="traffic">Traffic</option>
                  </select>
                </div>
              </div>

              <div className="issues-grid">
                {filteredIssues.map((issue) => {
                  const statusText = {
                    'pending': 'Pending',
                    'progress': 'In Progress',
                    'resolved': 'Resolved'
                  }[issue.status];
                  
                  const categoryText = issue.category.charAt(0).toUpperCase() + issue.category.slice(1);

                  return (
                    <div key={issue.id} className="issue-card">
                      <div className="issue-img-wrapper">
                        <img src={issue.image} alt={issue.title} className="issue-img" />
                      </div>
                      <div className="issue-content">
                        <div className="issue-meta">
                          <span className={`badge badge-cat-${issue.category}`}>{categoryText}</span>
                          <span className={`badge badge-status-${issue.status}`}>{statusText}</span>
                        </div>
                        <h3 className="issue-title">{issue.title}</h3>
                        <p className="issue-location">
                          <MapPin size={16} /> {issue.location}
                        </p>
                        
                        <div className="issue-footer">
                          <span className="issue-time">{issue.timestamp}</span>
                          <button 
                            className={`upvote-btn ${issue.voted ? 'voted' : ''}`}
                            onClick={() => toggleVote(issue.id)}
                          >
                            <ChevronUp size={16} strokeWidth={issue.voted ? 3 : 2} />
                            <span>{issue.votes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === 'report' && (
            <section className="view-section active">
              <div className="view-header">
                <div>
                  <h1>Report a <span>New Issue</span></h1>
                  <p className="subtitle">Submit an editorial-quality report to improve the community.</p>
                </div>
              </div>

              <form className="report-form" onSubmit={handleSubmit} noValidate>
                <div className={`form-group ${errors.image ? 'has-error' : ''}`}>
                  <label>Photo Evidence <span style={{color: '#8b0000'}}>*</span></label>
                  <div 
                    className="file-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('dragover');
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('dragover');
                    }}
                    onDrop={(e) => {
                      e.currentTarget.classList.remove('dragover');
                      handleDrop(e);
                    }}
                  >
                    <Camera size={48} strokeWidth={1} />
                    <p>Drag and drop a photo or <span>browse</span></p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <div className="preview-container">
                        <img src={previewImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                  {errors.image && <span className="error-message">{errors.image}</span>}
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
                    <label htmlFor="fullName">Full Name <span style={{color: '#8b0000'}}>*</span></label>
                    <div className="input-with-icon">
                      <User size={20} />
                      <input 
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                        placeholder="John Doe" 
                        value={formName}
                        onChange={handleNameChange}
                      />
                    </div>
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>
                  
                  <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="email">Email Address <span style={{color: '#8b0000'}}>*</span></label>
                    <div className="input-with-icon">
                      <Mail size={20} />
                      <input type="text" name="email" id="email" placeholder="john@example.com" />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                    <label htmlFor="phone">Phone Number (Optional)</label>
                    <div className="input-with-icon">
                      <Phone size={20} />
                      <input 
                        type="text" 
                        name="phone" 
                        id="phone" 
                        placeholder="1234567890" 
                        value={formPhone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className={`form-group ${errors.severity ? 'has-error' : ''}`}>
                    <label htmlFor="severity">Severity Level <span style={{color: '#8b0000'}}>*</span></label>
                    <div className="input-with-icon">
                      <AlertTriangle size={20} />
                      <select name="severity" id="severity" defaultValue="">
                        <option value="" disabled>Select severity</option>
                        <option value="low">Low - Not urgent</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Dangerous</option>
                        <option value="critical">Critical - Emergency</option>
                      </select>
                    </div>
                    {errors.severity && <span className="error-message">{errors.severity}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
                    <label htmlFor="category">Category <span style={{color: '#8b0000'}}>*</span></label>
                    <div className="input-with-icon">
                      <Tag size={20} />
                      <select name="category" id="category" defaultValue="">
                        <option value="" disabled>Select a category</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="sanitation">Sanitation</option>
                        <option value="utilities">Utilities</option>
                        <option value="traffic">Traffic</option>
                      </select>
                    </div>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                  </div>
                  
                  <div className={`form-group ${errors.location ? 'has-error' : ''}`}>
                    <label htmlFor="location">Location <span style={{color: '#8b0000'}}>*</span></label>
                    <div className="input-with-icon">
                      <MapPin size={20} />
                      <input type="text" name="location" id="location" placeholder="e.g. 123 Main St" />
                    </div>
                    {errors.location && <span className="error-message">{errors.location}</span>}
                  </div>
                </div>

                <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
                  <label htmlFor="description">Description <span style={{color: '#8b0000'}}>*</span></label>
                  <textarea name="description" id="description" rows={4} placeholder="Provide more details about the issue (min 20 characters)..."></textarea>
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setPreviewImage(null);
                      setErrors({});
                      setFormName('');
                      setFormPhone('');
                      setActiveTab('feed');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">Submit Report</button>
                </div>
              </form>
            </section>
          )}
        </div>

        {/* Sidebar Area */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2><BellRing size={18} /> Announcements</h2>
            <div className="announcement-card">
              <h4>City Clean-up Drive</h4>
              <p>Join us this Saturday at Centennial Park to help clean the trails.</p>
            </div>
            <div className="announcement-card">
              <h4>Roadwork Notice</h4>
              <p>Main St. will be partially closed next week for pothole repairs.</p>
            </div>
          </div>

          <div className="sidebar-section">
            <h2><Trophy size={18} /> Top Contributors</h2>
            <div className="leaderboard">
              {topContributors.map((user, idx) => (
                <div key={idx} className="leaderboard-item">
                  <div className="leader-info">
                    <div className="leader-avatar">{user.initial}</div>
                    <span className="leader-name">{user.name}</span>
                  </div>
                  <span className="leader-pts">{user.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </main>

      <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
        <div className="modal">
          <div className="modal-icon success">
            <CheckCircle size={64} strokeWidth={2} />
          </div>
          <h2>Report Submitted!</h2>
          <p>Thank you for making our community better. You can track the status of your issue in the feed.</p>
          <button className="btn-primary w-100" onClick={handleModalClose}>Back to Feed</button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <Building size={24} strokeWidth={2.5} />
              <span>CivicConnect</span>
            </div>
            <p>Empowering citizens to build better, safer, and cleaner communities across India. Report issues instantly and track resolution progress.</p>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p><Phone size={18} /> 1800-CIVIC-HELP</p>
            <p><Mail size={18} /> contact@civicconnect.in</p>
            <p><MapPin size={18} /> 12th Floor, Civic Tower, New Delhi, India 110001</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} CivicConnect India. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default App;
