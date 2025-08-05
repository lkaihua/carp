import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { OverlaysProvider } from "@blueprintjs/core";

const rootElement = document.getElementById('root')!;
const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <OverlaysProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </OverlaysProvider>
  </StrictMode>,
);