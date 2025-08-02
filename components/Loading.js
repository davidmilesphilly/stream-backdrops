// Create this new file: components/Loading.js

import { useEffect, useState } from 'react';

export default function Loading({ 
  text = 'Loading...', 
  showProgress = false,
  timeout = 10000 
}) {
  const [progress, setProgress] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    let progressInterval;
    let timeoutId;

    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Don't complete artificially
          return prev + Math.random() * 15;
        });
      }, 100);
    }

    // Timeout handling
    timeoutId = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showProgress, timeout]);

  if (isTimeout) {
    return (
      <div style={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{ color: '#ef4444', fontSize: '1.1rem' }}>
          Loading is taking longer than expected
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    }}>
      {/* Optimized spinner */}
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #f3f4f6',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        willChange: 'transform'
      }} />
      
      <div style={{ color: '#6b7280', fontSize: '1rem' }}>
        {text}
      </div>
      
      {showProgress && (
        <div style={{
          width: '200px',
          height: '4px',
          background: '#f3f4f6',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#2563eb',
            transition: 'width 0.3s ease',
            borderRadius: '2px'
          }} />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}