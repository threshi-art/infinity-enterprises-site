(function() {
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  
  var path = location.pathname;
  if (path.startsWith('/admin') || path.startsWith('/login')) return;
  
  function send() {
    var data = JSON.stringify({ path: path, ref: document.referrer || '' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/pv', data);
    } else {
      fetch('/api/pv', {
        method: 'POST',
        body: data,
        keepalive: true,
        headers: { 'content-type': 'application/json' }
      }).catch(function() {});
    }
  }
  
  if (document.readyState === 'complete') {
    send();
  } else {
    window.addEventListener('load', send);
  }
})();
