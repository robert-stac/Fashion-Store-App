import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { InventoryProvider } from './context/InventoryContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InventoryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InventoryProvider>
  </React.StrictMode>,
)