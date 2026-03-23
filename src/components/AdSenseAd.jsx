import React, { useEffect, useRef } from 'react';

const AdSenseAd = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  layout = '', 
  layoutKey = '',
  className = '' 
}) => {
  const adRef = useRef(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (adInitialized.current || !adSlot) return;

    const initializeAd = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInitialized.current = true;
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    // Load AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1522324464144333';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = initializeAd;
      document.head.appendChild(script);
    } else {
      initializeAd();
    }

    // Cleanup function
    return () => {
      adInitialized.current = false;
    };
  }, [adSlot]);

  // Don't render if no adSlot provided
  if (!adSlot) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      style={style}
      className={className}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          textAlign: 'center'
        }}
        data-ad-client="ca-pub-1522324464144333"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseAd;
