import { App } from './app.jsx'
import { createRoot } from 'react-dom/client';
import './index.css'

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
