import { useState, useEffect, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // Asetetaan cookie
  const setCookie = (name: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=$(encodeURIComponent(value)}; expires=${expires}; path=/`;
  };
  // Luetaan cookie
  const getCookie = (name: string): number | 0 => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const num = parseInt(decodeURIComponent(parts.pop()?.split(';').shift() || ''), 10);
      return num;
    }
    return 0;
  };

  const [count, setCount] = useState(getCookie('Count') | 0)

  const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
    console.log('Toiminto(X, Y): ' + event.pageX + ' ' + event.pageY + ')');
    setCount((count) => count + 1);
  }, [setCookie]);

  useEffect(() => {
    console.log('Viesti efektifunktiosta')
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={(handleClick)}>
          Laskurin arvo {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
