import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import 'lenis/dist/lenis.css';
import './styles/global.css';
import './styles/projects.css';
import './styles/experience.css';
import './styles/contact.css';
import './styles/work.css';
import './styles/polish.css';
import { Opening } from './components/Opening';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Opening /></React.StrictMode>,
);
