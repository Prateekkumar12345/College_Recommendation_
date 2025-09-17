import React, { useState } from 'react';
import './VisualizationDisplay.css';

const VisualizationDisplay = ({ studentData, onVisualize }) => {
  const [visualizations, setVisualizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleVisualize = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await onVisualize(studentData);
      setVisualizations(data.visualizations || []);
    } catch (err) {
      setError(err.message || 'Failed to generate visualizations');
    } finally {
      setLoading(false);
    }
  };

  const filterVisualizationsByTab = (visualizations, tab) => {
    if (tab === 'all') return visualizations;
    
    const tabFilters = {
      profile: ['radar', 'profile'],
      clusters: ['scatter'],
      recommendations: ['bar', 'similarity']
    };
    
    return visualizations.filter(viz => 
      tabFilters[tab]?.some(type => viz.chart_type.includes(type) || viz.title.toLowerCase().includes(type))
    );
  };

  const filteredVisualizations = filterVisualizationsByTab(visualizations, activeTab);

  return (
    <div className="visualization-display">
      <div className="visualization-header">
        <h3>Data Visualization</h3>
        <button 
          onClick={handleVisualize} 
          disabled={loading || !studentData}
          className="visualize-btn"
        >
          {loading ? 'Generating Visualizations...' : 'Generate Visualizations'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {visualizations.length > 0 && (
        <div className="visualization-tabs">
          <button 
            className={activeTab === 'all' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('all')}
          >
            All ({visualizations.length})
          </button>
          <button 
            className={activeTab === 'profile' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('profile')}
          >
            Profile Analysis
          </button>
          <button 
            className={activeTab === 'clusters' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('clusters')}
          >
            Clustering
          </button>
          <button 
            className={activeTab === 'recommendations' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('recommendations')}
          >
            Match Scores
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Generating visualizations...</p>
        </div>
      )}

      {filteredVisualizations.length > 0 && (
        <div className="visualization-grid">
          {filteredVisualizations.map((viz, index) => (
            <div key={index} className="visualization-card">
              <div className="visualization-header-card">
                <h4>{viz.title}</h4>
                <span className="chart-type-badge">{viz.chart_type}</span>
              </div>
              
              <div className="visualization-content">
                {viz.data.image && (
                  <img 
                    src={`data:image/png;base64,${viz.data.image}`} 
                    alt={viz.title}
                    className="visualization-image"
                  />
                )}
              </div>
              
              <div className="visualization-description">
                <p>{viz.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {visualizations.length === 0 && !loading && (
        <div className="no-visualizations">
          <p>Click "Generate Visualizations" to see insights about your profile and recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default VisualizationDisplay;