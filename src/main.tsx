import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 개발 환경에서 테스트 함수를 전역으로 노출
if (import.meta.env.DEV) {
  import('./utils/__tests__/storage.test').then(({ runStorageTests }) => {
    (window as any).runStorageTests = runStorageTests;
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

