// ===== Utility Functions =====

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function clearMainForm() {
  document.getElementById('main').innerHTML = '';
}

function pushState(state) {
  history.pushState(state, '', '');
}

function replaceState(state) {
  history.replaceState(state, '', '');
}

function isLocalHost() {
  const protocol = window.location.protocol;
  return protocol === 'file:' || (protocol === 'http:' && window.location.hostname === 'localhost');
}

function onDomReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}
