const input = document.getElementById('wordInput');
const resultBox = document.getElementById('resultBox');
const suggestionsBox = document.getElementById('suggestionsBox');
const clearBtn = document.getElementById('clearButton');
const retryBtn = document.getElementById('retryButton');
const installBtn = document.getElementById('install-btn');
document.getElementById('year').textContent = new Date().getFullYear();

let kamusMap = new Map();
let debounceTimer;
let deferredPrompt;

function setDefaultMessage() {
  resultBox.style.whiteSpace = 'pre-line';
  resultBox.textContent = `Adil Ka' Talino,\nBacuramitn Ka' Saruga,\nBasengat Ka' Jubata.`;
}

async function loadKamus() {
  retryBtn.style.display = 'none';
  resultBox.textContent = 'Memuat kamus...';

  try {
    const res = await fetch('data-max.json?v=' + Date.now());
    const { kamus } = await res.json();
    kamusMap = new Map(Object.entries(kamus['id-dayak']));
    setDefaultMessage();
  } catch (e) {
    console.error(e);
    resultBox.textContent = 'Gagal memuat kamus.';
    retryBtn.style.display = 'inline-flex';
  }
}

function debounce(fn, delay = 300) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function renderSuggestions(list) {
  suggestionsBox.innerHTML = '';
  const fragment = document.createDocumentFragment();
  list.slice(0, 5).forEach(({ id, dy }) => {
    const li = document.createElement('li');
    li.textContent = `${id} → ${dy}`;
    li.tabIndex = 0;
    li.addEventListener('click', () => selectWord(id, dy));
    fragment.appendChild(li);
  });
  suggestionsBox.appendChild(fragment);
}

function selectWord(id, dy) {
  input.value = id;
  resultBox.innerHTML = `<strong>${id}</strong> → ${dy}`;
  suggestionsBox.innerHTML = '';
}

function searchWord() {
  const query = input.value.trim().toLowerCase();
  if (!query) {
    setDefaultMessage();
    suggestionsBox.innerHTML = '';
    return;
  }

  let found = false;
  const suggestions = [];

  for (const [id, dy] of kamusMap) {
    const idL = id.toLowerCase();
    const dyL = dy.toLowerCase();

    if (idL === query) {
      selectWord(id, dy);
      found = true;
      break;
    }
    if (dyL === query) {
      selectWord(dy, id);
      found = true;
      break;
    }
    if (idL.startsWith(query) || dyL.startsWith(query)) {
      suggestions.push({ id, dy });
    }
  }

  if (!found) {
    if (suggestions.length) {
      renderSuggestions(suggestions);
      resultBox.textContent = 'Pilih dari saran:';
    } else {
resultBox.innerHTML = 'Kata belum ada, tambahkan kata: <a href="https://wa.me/6285328736706" target="_blank" style="color: #1de9b6; font-weight: bold;">klik di sini untuk WhatsApp</a>';
      suggestionsBox.innerHTML = '';
    }
  }
}

// Event listeners
input.addEventListener('input', debounce(searchWord));
clearBtn.addEventListener('click', () => {
  input.value = '';
  searchWord();
  input.focus();
});
retryBtn.addEventListener('click', loadKamus);

loadKamus();

// PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (!isStandalone && installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  }
});

window.addEventListener('load', () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone && installBtn) {
    installBtn.style.display = 'none';
  }
});