import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import './i18n'

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

const isLocalDevHost = import.meta.env.DEV && (
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === 'localhost'
)

if (!isLocalDevHost) {
  void import("@github/spark/spark")
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
