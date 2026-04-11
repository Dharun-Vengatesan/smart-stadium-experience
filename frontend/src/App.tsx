import React, { useState, useEffect } from 'react';
import NavigationApp from './components/NavigationApp';
import { Activity, Map, Utensils, Info, AlertTriangle } from 'lucide-react';
// import { QueueData, fetchLiveQueues } from './lib/firebase';

interface QueueData {
  id: string;
  name: string;
  wait: number;
  level: 'low' | 'medium' | 'high';
  insight: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('navigate');
  const [demoMode, setDemoMode] = useState(false);
  const [queues, setQueues] = useState<QueueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback / Default static data if Firebase is disconnected
  const fallbackQueues: QueueData[] = [
    { id: '1', name: 'North Concession', wait: 5, level: 'low', insight: 'Low Traffic' },
    { id: '2', name: 'South Concession', wait: 18, level: 'medium', insight: 'Increasing Demand' },
    { id: '3', name: 'Main Gate Bar', wait: 35, level: 'high', insight: 'Peak Hours' }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      
      try {
        if (!apiUrl || apiUrl === "https://YOUR_CLOUD_RUN_URL") {
          throw new Error('Sensor unavailable: No API URL');
        }

        const response = await fetch(`${apiUrl}/api/queues`);
        if (!response.ok) throw new Error('Sensor unavailable: API Error');
        
        const liveData = await response.json();
        setQueues(liveData);
        setError(null);
      } catch (err: any) {
        // Fallback to static data if Cloud Run is not connected
        console.warn('API Fetch failed, using fallback:', err.message);
        setQueues(fallbackQueues);
        setError('Sensor unavailable');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [demoMode]);

  const getStatusClass = (level: string) => {
    switch(level) {
      case 'low': return 'status-low';
      case 'medium': return 'status-medium';
      case 'high': return 'status-high';
      default: return 'status-low';
    }
  };

  return (
    <div className="app-container">
      <div className="demo-toggle">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
          />
          Demo Mode
        </label>
      </div>

      <header className="header">
        <h1 className="hero-title">Stadium Flow</h1>
        <p className="hero-tagline">Real-time intelligence for the modern fan.</p>
      </header>

      <nav className="nav-container" aria-label="Main Navigation">
        <button 
          className={`nav-btn ${activeTab === 'navigate' ? 'active' : ''}`}
          onClick={() => setActiveTab('navigate')}
          aria-pressed={activeTab === 'navigate'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={18} />
            <span>Navigate</span>
          </div>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
          aria-pressed={activeTab === 'food'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={18} />
            <span>Food & Queues</span>
          </div>
        </button>
      </nav>

      <main id="main-content" tabIndex={-1}>
        {activeTab === 'navigate' && <NavigationApp demoMode={demoMode} />}
        
        {activeTab === 'food' && (
          <section aria-labelledby="queue-heading" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 id="queue-heading" style={{ margin: 0 }}>Live Queue Times</h2>
              <div className="badge-ai" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                border: error ? '1px solid var(--danger)' : '1px solid rgba(168, 85, 247, 0.3)',
                color: error ? 'var(--danger)' : '#c084fc'
              }}>
                {error ? <AlertTriangle size={12} /> : <Activity size={12} />}
                {error || 'Live Updates'}
              </div>
            </div>

            {queues.map((item) => (
              <div key={item.id} className="glass-card" aria-live="polite">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Concourse Level 1</p>
                  </div>
                  <div className={`status-indicator ${getStatusClass(item.level)}`}>
                    <div className="status-dot"></div>
                    {item.level.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span>Estimated Wait</span>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{item.wait} mins</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(100, (item.wait / 40) * 100)}%`, 
                        background: 'var(--primary)',
                        transition: 'width 1s ease-out'
                      }}></div>
                    </div>
                  </div>
                </div>

                <div className="gamification-prompt" style={{ margin: 0, padding: '0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={16} style={{ color: 'var(--success)' }} />
                  <span><strong>AI Insight:</strong> {item.insight}</span>
                </div>
              </div>
            ))}

            <div className="glass-card" style={{ border: '1px dashed var(--success)', background: 'rgba(16, 185, 129, 0.05)' }}>
              <p style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 600 }}>
                💡 Tip: Go to South Concession and earn 50 points!
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
