import { useState, useCallback } from 'react';

// Type definitions matching Backend RouteResponse
interface RouteStep {
  instruction: string;
  latitude: number;
  longitude: number;
  is_indoor: boolean;
}

interface RouteResponse {
  distance_meters: number;
  estimated_time_seconds: number;
  steps: RouteStep[];
  crowd_density_alert?: string;
}

export default function NavigationApp() {
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      // In a real application, fetch from /api/v1/navigation/route
      // Simulating network request for MVP offline-readiness
      setTimeout(() => {
        setRoute({
          distance_meters: 145.5,
          estimated_time_seconds: 120,
          steps: [
            { instruction: 'Walk straight for 50 meters', latitude: 34.0523, longitude: -118.2436, is_indoor: false },
            { instruction: 'Enter stadium through Gate A', latitude: 34.0522, longitude: -118.2437, is_indoor: true },
            { instruction: accessibilityMode ? 'Take the left elevator to level 2.' : 'Take the ramp to level 2.', latitude: 34.0524, longitude: -118.2436, is_indoor: true }
          ],
          crowd_density_alert: 'Heavy traffic near Gate B. Routing you via Gate A for a faster experience.'
        });
        setLoading(false);
        announceRouteToScreenReader('Route calculated. Estimated time 2 minutes.');
      }, 500);
    } catch (e) {
      // Handle Offline A* Routing fallback here via ServiceWorker or IndexedDB cached graph
      setLoading(false);
    }
  };

  const announceRouteToScreenReader = useCallback((message: string) => {
    // Uses aria-live politely, but via speech synthesis for voice assist mode if enabled
    if ('speechSynthesis' in window && accessibilityMode) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  }, [accessibilityMode]);

  return (
    <section aria-labelledby="nav-heading" className="nav-card">
      <h2 id="nav-heading">Smart Navigation</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={accessibilityMode}
            onChange={(e) => setAccessibilityMode(e.target.checked)}
            aria-label="Enable accessibility routing for elevators and voice assistance"
          />
          Accessibility Mode (Elevators & Voice)
        </label>
      </div>

      <button 
        className="btn-primary" 
        onClick={fetchRoute} 
        aria-busy={loading}
      >
        {loading ? 'Calculating Best Route...' : 'Find Fastest Route to Seat'}
      </button>

      {/* ARIA Live Region for accessibility to announce changes dynamically */}
      <div aria-live="assertive" className="sr-only">
        {loading ? 'Loading route' : route ? 'Route is ready to view below.' : ''}
      </div>

      {route && (
        <div style={{ marginTop: '1.5rem' }}>
          {route.crowd_density_alert && (
            <div className="gamification-prompt" role="alert">
              <strong>AI Crowd Alert: </strong>{route.crowd_density_alert}
            </div>
          )}
          
          <h3>Directions ({Math.round(route.estimated_time_seconds / 60)} min)</h3>
          <ol aria-label="Step by step routing instructions">
            {route.steps.map((step, idx) => (
              <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--surface)' }}>
                {step.instruction}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
