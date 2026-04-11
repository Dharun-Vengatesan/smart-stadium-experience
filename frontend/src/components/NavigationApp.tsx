import React, { useState, useCallback } from 'react';
import { Navigation, ShieldCheck, Info, ChevronRight, Speaker, Zap } from 'lucide-react';
import Skeleton from './Skeleton';

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

interface NavigationAppProps {
  demoMode: boolean;
}

export default function NavigationApp({ demoMode }: NavigationAppProps) {
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const fetchRoute = async () => {
    setLoading(true);
    setRoute(null);
    
    // Simulate API delay
    setTimeout(() => {
      setRoute({
        distance_meters: 145.5,
        estimated_time_seconds: 120,
        steps: [
          { instruction: 'Move forward towards North Tunnel', latitude: 34.0523, longitude: -118.2436, is_indoor: false },
          { instruction: 'Enter stadium through Gate A (VIP)', latitude: 34.0522, longitude: -118.2437, is_indoor: true },
          { instruction: accessibilityMode ? 'Take the left elevator to level 2.' : 'Take the ramp to level 2.', latitude: 34.0524, longitude: -118.2436, is_indoor: true },
          { instruction: 'Your seat is 5 meters ahead in Section 204', latitude: 34.0525, longitude: -118.2435, is_indoor: true }
        ],
        crowd_density_alert: 'Heavy traffic near Gate B. AI routed you via Gate A for a 40% faster experience.'
      });
      setLoading(false);
      if (accessibilityMode) {
        announceRouteToScreenReader('Route calculated. Estimated time 2 minutes.');
      }
    }, 1500);
  };

  const announceRouteToScreenReader = useCallback((message: string) => {
    if ('speechSynthesis' in window && accessibilityMode) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  }, [accessibilityMode]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <section aria-labelledby="nav-heading" className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
            <Navigation size={24} style={{ color: 'var(--primary-light)' }} />
          </div>
          <h2 id="nav-heading" style={{ margin: 0 }}>Smart Navigation</h2>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.75rem',
            borderRadius: '12px',
            border: '1px solid var(--surface-border)'
          }}>
            <input 
              type="checkbox" 
              checked={accessibilityMode}
              onChange={(e) => setAccessibilityMode(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              aria-label="Enable accessibility routing"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Accessibility Mode</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Routes via elevators & adds voice assistance</span>
            </div>
          </label>
        </div>

        <button 
          className="btn-primary" 
          onClick={fetchRoute} 
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Zap size={18} className="spin" />
              <span>Analyzing optimal path...</span>
            </>
          ) : (
            <>
              <Navigation size={18} />
              <span>Find Fastest Route to Seat</span>
            </>
          )}
        </button>
      </section>

      {/* ARIA Live Region */}
      <div aria-live="assertive" className="sr-only">
        {loading ? 'Calculating route' : route ? 'Route identified.' : ''}
      </div>

      {loading && (
        <div className="glass-card">
          <Skeleton width="100px" height="24px" className="mb-4" borderRadius="4px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Skeleton width="100%" height="40px" borderRadius="8px" />
            <Skeleton width="100%" height="40px" borderRadius="8px" />
            <Skeleton width="80%" height="40px" borderRadius="8px" />
          </div>
        </div>
      )}

      {route && !loading && (
        <div className="glass-card">
          {route.crowd_density_alert && (
            <div className="gamification-prompt" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="badge-ai" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>Crowd Intelligence</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)' }}>{route.crowd_density_alert}</p>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0 }}>Directions</h3>
            <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
              ~ {Math.round(route.estimated_time_seconds / 60)} min
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {route.steps.map((step, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.75rem', 
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ color: 'var(--primary-light)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem', borderRadius: '50%', flexShrink: 0 }}>
                  {idx === route.steps.length - 1 ? <ShieldCheck size={16} /> : <ChevronRight size={16} />}
                </div>
                <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>{step.instruction}</span>
                {step.is_indoor && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    Indoor
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
