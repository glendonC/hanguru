document.querySelector('.arrow').addEventListener('click', function() {
    window.parent.postMessage({ type: 'NAVIGATE', path: '/auth' }, '*');
  });