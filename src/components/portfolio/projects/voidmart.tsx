'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface VoidMartProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'ARTIFACT' | 'CONSUMABLE' | 'HARDWARE';
  color: string;
  icon: string;
  stock: number;
}

const products: Product[] = [
  { id: 1, name: 'CHROME SKULL', price: 499, category: 'ARTIFACT', color: 'var(--electric)', icon: '💀', stock: 12 },
  { id: 2, name: 'VOID ESSENCE', price: 1299, category: 'CONSUMABLE', color: 'var(--ice)', icon: '⚗️', stock: 45 },
  { id: 3, name: 'NEURAL IMPLANT', price: 2499, category: 'HARDWARE', color: 'var(--blood)', icon: '🔧', stock: 3 },
  { id: 4, name: 'QUANTUM SHARD', price: 799, category: 'ARTIFACT', color: 'var(--electric)', icon: '💎', stock: 8 },
  { id: 5, name: 'BIO GEL PACK', price: 299, category: 'CONSUMABLE', color: 'var(--ice)', icon: '🧪', stock: 67 },
  { id: 6, name: 'CYBER DECK', price: 3999, category: 'HARDWARE', color: 'var(--blood)', icon: '🖥️', stock: 2 },
  { id: 7, name: 'PLASMA CORE', price: 1899, category: 'HARDWARE', color: 'var(--blood)', icon: '⚡', stock: 15 },
  { id: 8, name: 'SOUL FRAGMENT', price: 599, category: 'ARTIFACT', color: 'var(--electric)', icon: '👁️', stock: 23 },
  { id: 9, name: 'STIM PACK', price: 149, category: 'CONSUMABLE', color: 'var(--ice)', icon: '💉', stock: 89 },
  { id: 10, name: 'NEURAL LINK', price: 3299, category: 'HARDWARE', color: 'var(--blood)', icon: '🧠', stock: 5 },
  { id: 11, name: 'DARK MATTER', price: 9999, category: 'ARTIFACT', color: 'var(--electric)', icon: '🕳️', stock: 1 },
  { id: 12, name: 'REGEN SERUM', price: 449, category: 'CONSUMABLE', color: 'var(--ice)', icon: '🩸', stock: 34 },
];

const categoryInfo = {
  ARTIFACT: { label: 'ARTIFACT', color: 'var(--electric)' },
  CONSUMABLE: { label: 'CONSUMABLE', color: 'var(--ice)' },
  HARDWARE: { label: 'HARDWARE', color: 'var(--blood)' },
};

export function VoidMart({ isOpen, onClose }: VoidMartProps) {
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  const filteredProducts = products
    .filter((p) => !selectedCategory || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const addToCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.qty > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product?.price || 0) * item.qty;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
          {/* Compact Header */}
          <motion.header
            className="border-b-4 px-3 md:px-4 py-2 flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--blood)', background: 'var(--void)' }}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-2">
              <h1
                className="text-lg md:text-xl tracking-wider"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--blood)' }}
              >
                VOIDMART
              </h1>
              <span
                className="hidden sm:inline text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 border"
                style={{ borderColor: 'var(--blood)', color: 'var(--blood)' }}
              >
                BRUTALIST E-COMMERCE
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Cart */}
              <motion.div
                className="flex items-center gap-1.5 px-2 py-1 border-2"
                style={{ borderColor: 'var(--electric)' }}
                whileHover={{ background: 'var(--electric)' }}
              >
                <span className="text-sm">🛒</span>
                <span
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
                >
                  {cartCount}
                </span>
                <span
                  className="text-xs hidden sm:inline"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--bone)' }}
                >
                  ${cartTotal.toLocaleString()}
                </span>
              </motion.div>

              <motion.button
                onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-2 py-1 border-2 text-[9px] tracking-wider uppercase flex items-center gap-1.5"
                style={{ borderColor: 'var(--ice)', color: 'var(--ice)' }}
                whileHover={{ background: 'var(--ice)', color: 'var(--void)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                HOME
              </motion.button>
              <motion.button
                onClick={onClose}
                className="text-base px-2 py-1 border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--blood)', color: 'var(--blood)' }}
                whileHover={{ background: 'var(--blood)', color: 'var(--bone)' }}
                aria-label="Close project"
              >
                ✕
              </motion.button>
            </div>
          </motion.header>

          {/* Compact Filters Bar */}
          <motion.div
            className="border-b-2 px-3 md:px-4 py-1.5 flex items-center justify-between gap-3 flex-wrap shrink-0"
            style={{ borderColor: 'var(--rebar)' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span
                className="text-[8px] tracking-[0.1em] shrink-0"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                FILTER:
              </span>
              <motion.button
                onClick={() => setSelectedCategory(null)}
                className="px-1.5 py-0.5 border text-[8px] tracking-wider uppercase shrink-0"
                style={{
                  fontFamily: 'var(--font-mono)',
                  borderColor: !selectedCategory ? 'var(--electric)' : 'var(--rebar)',
                  background: !selectedCategory ? 'var(--electric)' : 'transparent',
                  color: !selectedCategory ? 'var(--void)' : 'var(--ghost)',
                }}
                whileHover={{ borderColor: 'var(--electric)' }}
              >
                ALL
              </motion.button>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <motion.button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="px-1.5 py-0.5 border text-[8px] tracking-wider uppercase shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    borderColor: selectedCategory === key ? info.color : 'var(--rebar)',
                    background: selectedCategory === key ? info.color : 'transparent',
                    color: selectedCategory === key ? 'var(--void)' : 'var(--ghost)',
                  }}
                  whileHover={{ borderColor: info.color }}
                >
                  {info.label}
                </motion.button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5">
              <span
                className="text-[8px] tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                SORT:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent border px-1.5 py-0.5 text-[8px] uppercase tracking-wider"
                style={{
                  fontFamily: 'var(--font-mono)',
                  borderColor: 'var(--rebar)',
                  color: 'var(--ghost)',
                }}
              >
                <option value="name">NAME</option>
                <option value="price-asc">PRICE ↑</option>
                <option value="price-desc">PRICE ↓</option>
              </select>
            </div>
          </motion.div>

          {/* Main Content - Compact Product Grid */}
          <div className="flex-1 overflow-auto">
            <div className="p-2 md:p-3">
              <motion.div
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-0"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.02 } },
                }}
              >
                {filteredProducts.map((product) => {
                  const inCart = cart.find((item) => item.id === product.id);
                  return (
                    <motion.div
                      key={product.id}
                      className="border relative overflow-hidden group"
                      style={{ borderColor: 'var(--rebar)', marginRight: '-1px', marginBottom: '-1px' }}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      whileHover={{
                        borderColor: product.color,
                        boxShadow: `2px 2px 0 ${product.color}`,
                        zIndex: 10,
                      }}
                    >
                      {/* Stock indicator */}
                      {product.stock <= 5 && (
                        <div
                          className="absolute top-0.5 right-0.5 text-[7px] px-0.5 z-10"
                          style={{
                            background: 'var(--blood)',
                            color: 'var(--bone)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          LOW
                        </div>
                      )}

                      {/* Icon - Compact */}
                      <div
                        className="aspect-square flex items-center justify-center text-2xl md:text-3xl"
                        style={{ background: 'var(--concrete)' }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {product.icon}
                        </motion.span>
                      </div>

                      {/* Info - Ultra Compact */}
                      <div className="p-1.5">
                        {/* Category */}
                        <span
                          className="text-[7px] tracking-[0.1em] uppercase block"
                          style={{
                            color: product.color,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {product.category}
                        </span>

                        {/* Name */}
                        <h3
                          className="text-[10px] md:text-xs leading-tight mt-0.5 truncate"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}
                        >
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center justify-between mt-0.5">
                          <span
                            className="text-xs md:text-sm leading-none"
                            style={{ fontFamily: 'var(--font-display)', color: product.color }}
                          >
                            ${product.price}
                          </span>
                          <span
                            className="text-[7px]"
                            style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                          >
                            ×{product.stock}
                          </span>
                        </div>

                        {/* Add Button - Compact */}
                        <motion.button
                          onClick={() => addToCart(product.id)}
                          className="w-full mt-1 py-1 border text-[7px] tracking-wider uppercase"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            borderColor: inCart ? product.color : 'var(--rebar)',
                            background: inCart ? product.color : 'transparent',
                            color: inCart ? 'var(--void)' : 'var(--ghost)',
                          }}
                          whileHover={{
                            borderColor: product.color,
                            background: product.color,
                            color: 'var(--void)',
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {inCart ? `+${inCart.qty}` : 'ADD'}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Compact Cart Footer */}
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div
                className="border-t-4 p-2 md:p-3 shrink-0"
                style={{ borderColor: 'var(--electric)', background: 'var(--concrete)' }}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Cart Items - Horizontal Scroll */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-1.5">
                      {cart.map((item) => {
                        const product = products.find((p) => p.id === item.id);
                        if (!product) return null;
                        return (
                          <motion.div
                            key={item.id}
                            className="flex items-center gap-1 border px-1.5 py-0.5 shrink-0"
                            style={{ borderColor: product.color }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <span className="text-sm">{product.icon}</span>
                            <span
                              className="text-[10px]"
                              style={{ fontFamily: 'var(--font-mono)', color: 'var(--bone)' }}
                            >
                              ×{item.qty}
                            </span>
                            <span
                              className="text-xs"
                              style={{ fontFamily: 'var(--font-display)', color: product.color }}
                            >
                              ${(product.price * item.qty).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[9px] ml-0.5"
                              style={{ color: 'var(--blood)' }}
                            >
                              ✕
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div
                        className="text-[8px]"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
                      >
                        TOTAL
                      </div>
                      <div
                        className="text-lg md:text-xl"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--electric)' }}
                      >
                        ${cartTotal.toLocaleString()}
                      </div>
                    </div>
                    <motion.button
                      className="px-3 py-1.5 border-2 text-xs tracking-wider uppercase"
                      style={{
                        fontFamily: 'var(--font-display)',
                        background: 'var(--electric)',
                        borderColor: 'var(--electric)',
                        color: 'var(--void)',
                      }}
                      whileHover={{ boxShadow: '3px 3px 0 var(--electric)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      CHECKOUT →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Footer */}
          <motion.footer
            className="border-t-2 px-3 py-1.5 flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--rebar)', background: 'var(--void)' }}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: 'var(--blood)' }} />
              <span
                className="text-[8px] tracking-[0.1em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
              >
                SECURE • {products.length} PRODUCTS
              </span>
            </div>
            <span
              className="text-[8px]"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ghost)' }}
            >
              SHOPIFY · GSAP · THREE.js
            </span>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
