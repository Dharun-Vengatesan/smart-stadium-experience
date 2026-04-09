
import NavigationApp from './components/NavigationApp'
import { useState, useEffect, useRef } from "react";
function App() {
  const [activeTab, setActiveTab] = useState('navigate');

  return (
    <div className="app-container" role="document">
      <header role="banner" className="header">
        <h1>Stadium Flow</h1>
        <nav aria-label="Main Navigation">
          <button 
            aria-pressed={activeTab === 'navigate'}
            onClick={() => setActiveTab('navigate')}
          >
            Navigate
          </button>
          <button 
            aria-pressed={activeTab === 'food'}
            onClick={() => setActiveTab('food')}
          >
            Food & Queues
          </button>
        </nav>
      </header>

      <main id="main-content" role="main" tabIndex={-1}>
        {activeTab === 'navigate' && <NavigationApp />}
        {activeTab === 'food' && (
          <section aria-labelledby="queue-heading">
            <h2 id="queue-heading">Live Queue Times</h2>
            <div className="queue-card" aria-live="polite">
              <h3>North Concession</h3>
              <p>Estimated wait: <strong>5 mins</strong></p>
              <span className="badge badge-ai" aria-label="AI predicted using real-time data">AI Predictive Insight: Low Traffic</span>
            </div>
            <div className="gamification-prompt" role="alert">
              <p>Go to South Concession and earn <strong>50 points</strong>! (Less crowded)</p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
