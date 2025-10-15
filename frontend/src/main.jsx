import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './custom.css'
import App from './App.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <CurrencyProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </CurrencyProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
)