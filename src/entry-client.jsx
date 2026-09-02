import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

const root = document.getElementById('root');
const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Les pages sont pré-rendues au build : on hydrate le HTML existant.
// createRoot ne sert que si le marqueur est absent (dev, ou page non pré-rendue).
if (root.dataset.prerendered === 'true') hydrateRoot(root, tree);
else createRoot(root).render(tree);
