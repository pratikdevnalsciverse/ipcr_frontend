import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './routes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// const DESIGN_WIDTH = 1920;
// const DESIGN_HEIGHT = 1080;

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1152;

function ScreenScaler({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  const [diagonalCm, setDiagonalCm] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / DESIGN_WIDTH;
      const scaleY = window.innerHeight / DESIGN_HEIGHT;
      setScale(Math.min(scaleX, scaleY));

      // Calculate diagonal in cm: 96 pixels = 2.54 cm
      const diagPx = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      setDiagonalCm((diagPx * 2.54) / 96);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      // show diagonal size of container with fainted gray in cm 
      className="w-screen h-screen overflow-hidden flex items-center justify-center bg-neutral-canvas relative"
    >
      {/* <div className="absolute bottom-4 left-4 text-sm font-mono text-neutral-muted/30 select-none pointer-events-none z-20">
        {diagonalCm.toFixed(1)} cm
      </div> */}
      <div
        className="origin-center"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScreenScaler>
          <AppRouter />
        </ScreenScaler>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

