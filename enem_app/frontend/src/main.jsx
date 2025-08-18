import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/main.sass';
import AppFlash from './AppFlash';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppFlash />
  </StrictMode>,
);
