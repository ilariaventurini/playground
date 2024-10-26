import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import 'modern-normalize'
import './index.css'
import { StateProvider, globalState } from './state/index.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StateProvider value={globalState}>
      <App />
    </StateProvider>
  </React.StrictMode>
)
