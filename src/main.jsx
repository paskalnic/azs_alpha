import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Équivalent du `document.documentElement.className += ' js'` de la maquette :
// conditionne les styles d'apparition au scroll.
document.documentElement.classList.add('js');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
