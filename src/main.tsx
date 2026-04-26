import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import './i18n'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./index.css"

const isLocalHost = (
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === 'localhost'
)

if (!isLocalHost) {
  void import("@github/spark/spark")
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
