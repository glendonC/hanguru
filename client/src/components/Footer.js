import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  useEffect(() => {
    const messageHandler = (event) => {
      if (event.data.type === 'NAVIGATE') {
        navigate(event.data.path);
      }
    };

    window.addEventListener('message', messageHandler);

    const resizeIframe = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
      }
    };
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', resizeIframe);
    }

    return () => {
      window.removeEventListener('message', messageHandler);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', resizeIframe);
      }
    };
  }, [navigate]);

  return (
  <iframe 
    ref={iframeRef}
    src="/footer/footer.html"
    style={{ width: '100%', border: 'none' }}
    title="Footer Page"
  ></iframe>
  );
}

export default Footer;
