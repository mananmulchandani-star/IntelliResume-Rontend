import React, { useEffect, useRef, useState } from 'react';

/**
 * AdBanner - Production-ready Google AdSense component
 * Features:
 * - Lazy loading with Intersection Observer
 * - Prevents duplicate rendering
 * - Responsive design
 * - Clean error handling
 * - Proper cleanup
 * 
 * IMPORTANT: Replace adSlot with your actual AdSense slot ID
 * Publisher ID: ca-pub-1522324464144333
 */
const AdBanner = ({ 
  adSlot, 
  adFormat = 'auto',
  adLayout = '',
  adLayoutKey = '',
  className = '',
  style = {},
  showOnlyWhen = 'always' // 'always', 'desktop-only', 'mobile-only'
}) => {
  const adRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!adSlot || !adRef.current) return;

    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, options);

    observerRef.current.observe(adRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [adSlot]);

  // Load AdSense ad when component becomes visible
  useEffect(() => {
    if (!isVisible || !adSlot || isLoaded) return;

    const loadAdSense = () => {
      try {
        // Prevent duplicate initialization
        if (window.adsbygoogle && window.adsbygoogle.loaded) {
          return;
        }

        // Check if AdSense script is already loaded
        if (!window.adsbygoogle) {
          console.warn('AdSense script not loaded globally. Ensure script is in index.html');
          return;
        }

        // Push ad configuration
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      } catch (err) {
        console.error('AdSense initialization error:', err);
        setError('Failed to load advertisement');
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadAdSense, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, adSlot, isLoaded]);

  // Don't render if no adSlot provided
  if (!adSlot) {
    console.warn('AdBanner: No adSlot provided. Component will not render.');
    return null;
  }

  // Handle visibility based on showOnlyWhen prop
  const shouldRender = () => {
    if (showOnlyWhen === 'always') return true;
    if (showOnlyWhen === 'desktop-only' && window.innerWidth < 768) return false;
    if (showOnlyWhen === 'mobile-only' && window.innerWidth >= 768) return false;
    return true;
  };

  if (!shouldRender()) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`ad-banner-container ${className}`}
      style={{
        margin: '24px 0',
        textAlign: 'center',
        overflow: 'hidden',
        borderRadius: '8px',
        ...style
      }}
    >
      {error ? (
        <div style={{
          padding: '20px',
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          color: '#6c757d'
        }}>
          <p>{error}</p>
          <small>Advertisement temporarily unavailable</small>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center',
            maxWidth: '100%',
            margin: '0 auto'
          }}
          data-ad-client="ca-pub-1522324464144333"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-ad-layout={adLayout}
          data-ad-layout-key={adLayoutKey}
          data-full-width-responsive="true"
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && !error && (
        <div style={{
          height: adFormat === 'rectangle' ? '250px' : '90px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '14px'
        }}>
          Loading advertisement...
        </div>
      )}

      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Hide ad placeholder when ad loads */
        .adsbygoogle[data-ad-status="loaded"] + div {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdBanner;

/**
 * USAGE:
 * 
 * 1. Homepage (below hero section):
 *    <AdBanner adSlot="REPLACE_WITH_HOMEPAGE_SLOT_ID" />
 * 
 * 2. Dashboard (below main content):
 *    <AdBanner adSlot="REPLACE_WITH_DASHBOARD_SLOT_ID" />
 * 
 * 3. After Download Success:
 *    <AdBanner adSlot="REPLACE_WITH_DOWNLOAD_SUCCESS_SLOT_ID" />
 * 
 * IMPORTANT: Replace REPLACE_WITH_SLOT_ID with your actual AdSense slot IDs
 * Publisher ID is already set: ca-pub-1522324464144333
 */