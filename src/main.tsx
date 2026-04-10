import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx' // Sesuaikan jika path/nama file Anda berbeda
import './index.css' // Sesuaikan dengan file CSS Anda

// Tanda seru (!) di bawah ini memaksa TypeScript yakin bahwa elemen root itu ada
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)