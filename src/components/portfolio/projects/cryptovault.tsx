'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

interface CryptoVaultProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Coin {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
}

const coins: Coin[] = [
  { symbol: 'BTC', name: 'BITCOIN', price: 67842.50, change: 2.34, volume: '$28.4B' },
  { symbol: 'ETH', name: 'ETHEREUM', price: 3421.80, change: -1.23, volume: '$12.1B' },
  { symbol: 'SOL', name: 'SOLANA', price: 178.45, change: 5.67, volume: '$4.2B' },
  { symbol: 'AVAX', name: 'AVALANCHE', price: 42.18, change: 3.45, volume: '$890M' },
  { symbol: 'LINK', name: 'CHAINLINK', price: 18.92, change: -0.87, volume: '$456M' },
  { symbol: 'DOT', name: 'POLKADOT', price: 8.45, change: 1.23, volume: '$234M' },
];

export function CryptoVault({ isOpen, onClose }: CryptoVaultProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coins[0]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Generate random heatmap data
  const generateHeatmap = useCallback(() => {
    const data: number[][] = [];
    for (let i = 0; i < 20; i++) {
      const row: number[] = [];
      for (let j = 0; j < 30; j++) {
        row.push(Math.random() * 100);
      }
      data.push(row);
    }
    setHeatmapData(data);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Initial generation after a small delay
    const initialTimeout = setTimeout(() => {
      generateHeatmap();
    }, 0);

    const interval = setInterval(() => {
      generateHeatmap();
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isOpen, generateHeatmap]);

  // Draw heatmap on canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current || heatmapData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cellWidth = canvas.width / heatmapData[0].length;
    const cellHeight = canvas.height / heatmapData.length;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      heatmapData.forEach((row, i) => {
        row.forEach((value, j) => {
          const hue = value > 50 ? 55 : 0; // yellow for positive, red for negative
          const lightness = 30 + (value / 100) * 30;
          const saturation = 80 + (value / 100) * 20;

          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(
            j * cellWidth + 1,
            i * cellHeight + 1,
            cellWidth - 2,
            cellHeight - 2
          );
        });
      });

      // Add scan line effect
      const scanY = (Date.now() / 20) % canvas.height;
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationRef.current);
  }, [isOpen, heatmapData]);

  // Update prices periodically
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col overflow-hidden"
          style={{ background: 'var(--void)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <motion.header
            className="border-b-4 px-6 py-4 flex items-center justify-between"
            style={{ borderColor: 'var(--ice)' }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-4">
              <h1
                className="text-2xl md:text-4xl tracking-wider"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}
              >
                CRYPTOVAULT
              </h1>
              <span
                className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 border"
                style={{ borderColor: 'var(--ice)', color: 'var(--ice)' }}
              >
                VOLATILITY TRACKER
              </span>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-4 py-2 border-2 text-[11px] tracking-wider uppercase flex items-center gap-2"
                style={{ borderColor: 'var(--ice)', color: 'var(--ice)' }}
                whileHover={{ background: 'var(--ice)', color: 'var(--void)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                HOME
              </motion.button>
              <motion.button
                onClick={onClose}
                className="text-2xl px-3 py-2 border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--blood)', color: 'var(--blood)' }}
                whileHover={{ background: 'var(--blood)', color: 'var(--bone)' }}
                aria-label="Close project"
              >
                ✕
              </motion.button>
            </div>
          </motion.header>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel - Coin List */}
            <motion.div
              className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 overflow-auto"
              style={{ borderColor: 'var(--rebar)' }}
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {coins.map((coin, index) => (
                <motion.button
                  key={coin.symbol}
                  onClick={() => setSelectedCoin(coin)}
                  className="w-full p-4 border-b-2 text-left"
                  style={{
                    borderColor: 'var(--rebar)',
                    background: selectedCoin.symbol === coin.symbol ? 'var(--rebar)' : 'transparent',
                  }}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ background: 'var(--rebar)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-lg"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
                    >
                      {coin.symbol}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: coin.change >= 0 ? 'var(--electric)' : 'var(--blood)',
                      }}
                    >
                      {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                    </span>
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                  >
                    ${coin.price.toLocaleString()}
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Selected Coin Info */}
              <motion.div
                className="border-b-4 p-4 md:p-6"
                style={{ borderColor: 'var(--rebar)' }}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-4xl md:text-5xl"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}
                      >
                        {selectedCoin.symbol}
                      </span>
                      <span
                        className="text-sm"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                      >
                        {selectedCoin.name}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span
                        className="text-4xl md:text-6xl"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}
                      >
                        ${selectedCoin.price.toLocaleString()}
                      </span>
                      <span
                        className="text-xl"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: selectedCoin.change >= 0 ? 'var(--electric)' : 'var(--blood)',
                        }}
                      >
                        {selectedCoin.change >= 0 ? '+' : ''}{selectedCoin.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[10px] mb-1"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                    >
                      24H VOLUME
                    </div>
                    <div
                      className="text-xl"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}
                    >
                      {selectedCoin.volume}
                    </div>
                  </div>
                </div>

                {/* Timeframe Selector */}
                <div className="flex gap-2 mt-4">
                  {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
                    <motion.button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className="px-4 py-2 border-2 text-[11px] tracking-wider"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        borderColor: timeframe === tf ? 'var(--ice)' : 'var(--rebar)',
                        background: timeframe === tf ? 'var(--ice)' : 'transparent',
                        color: timeframe === tf ? 'var(--void)' : 'var(--ghost)',
                      }}
                      whileHover={{ borderColor: 'var(--ice)' }}
                    >
                      {tf}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Heatmap Canvas */}
              <div className="flex-1 relative p-4 md:p-6">
                <motion.div
                  className="absolute inset-4 md:inset-6 border-4"
                  style={{ borderColor: 'var(--ice)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                  />
                  
                  {/* Overlay Labels */}
                  <div className="absolute top-2 left-2">
                    <span
                      className="text-[9px] tracking-[0.15em] uppercase"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--ice)' }}
                    >
                      VOLATILITY HEATMAP
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Panel - Stats */}
            <motion.div
              className="w-full md:w-72 border-t-4 md:border-t-0 md:border-l-4 p-4 md:p-6 overflow-auto"
              style={{ borderColor: 'var(--rebar)' }}
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3
                className="text-lg mb-4 tracking-wider"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
              >
                MARKET STATS
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'MARKET CAP', value: '$2.43T', change: '+2.1%' },
                  { label: 'BTC DOMINANCE', value: '54.2%', change: '-0.3%' },
                  { label: 'ACTIVE ADDRESSES', value: '1.2M', change: '+5.4%' },
                  { label: 'GAS PRICE', value: '24 GWEI', change: '-12%' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-b-2 pb-3"
                    style={{ borderColor: 'var(--rebar)' }}
                  >
                    <div
                      className="text-[10px] mb-1"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                    >
                      {stat.label}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xl"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}
                      >
                        {stat.value}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: stat.change.startsWith('+') ? 'var(--electric)' : 'var(--blood)',
                        }}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fear/Greed Index */}
              <div className="mt-6 p-4 border-2" style={{ borderColor: 'var(--ice)' }}>
                <div
                  className="text-[10px] mb-2"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                >
                  FEAR & GREED INDEX
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="text-5xl"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
                  >
                    72
                  </div>
                  <div
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--ice)' }}
                  >
                    GREED
                  </div>
                </div>
                <div
                  className="w-full h-2 mt-3"
                  style={{ background: 'var(--rebar)' }}
                >
                  <motion.div
                    className="h-full"
                    style={{ background: 'var(--electric)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            className="border-t-4 px-6 py-3 flex items-center justify-between"
            style={{ borderColor: 'var(--rebar)' }}
            initial={{ y: 30 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ice)' }} />
              <span
                className="text-[10px] tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                LIVE DATA VIA WEBSOCKET
              </span>
            </div>
            <span
              className="text-[10px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              WebGPU · D3.js · WebSocket
            </span>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
