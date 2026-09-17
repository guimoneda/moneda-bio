import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../lib/theme';

/**
 * A canvas test-matrix: a sweep runs across a grid of cells the way a suite runs
 * across a spec list, lighting each one as it passes and flagging a few in the
 * accent colour before they settle. It replaces the mocked-up "code editor
 * screenshot" that the hero used to carry — this is the subject rendered, not
 * a picture of it.
 *
 * Costs one rAF loop, no dependencies, and reads its palette from the live CSS
 * custom properties so it follows the theme toggle.
 */

const CELL = 15; // px between cell centres
const TAIL = 12; // how many columns the sweep's afterglow spans
const SPEED = 7.5; // columns per second

/** Deterministic per-cell noise — stable across frames, no allocation. */
const hash = (x: number, y: number, seed: number): number => {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
};

const SignalGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const inkRgb = styles.getPropertyValue('--ink').trim() || '237 233 225';
    const signalRgb = styles.getPropertyValue('--signal').trim() || '255 74 31';
    const ink = (a: number) => `rgb(${inkRgb} / ${a})`;
    const signal = (a: number) => `rgb(${signalRgb} / ${a})`;

    // Bone-on-near-black needs far more alpha to register than ink-on-paper does,
    // so the resting grid is tuned per theme rather than shared.
    const restAlpha = theme === 'ink' ? 0.26 : 0.14;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.floor(width / CELL));
      rows = Math.max(1, Math.floor(height / CELL));
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);

      const span = cols + TAIL + rows * 0.4;
      const pass = Math.floor((elapsed * SPEED) / span); // increments each sweep
      const sweep = (elapsed * SPEED) % span;

      // Centre the matrix in whatever box the layout gives us.
      const offsetX = (width - cols * CELL) / 2 + CELL / 2;
      const offsetY = (height - rows * CELL) / 2 + CELL / 2;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const distance = sweep - (c + r * 0.4);
          const energy = distance >= 0 && distance < TAIL ? 1 - distance / TAIL : 0;

          const x = offsetX + c * CELL;
          const y = offsetY + r * CELL;

          // Resting state: a faint 1px tick, so the grid reads even at zero energy.
          ctx.fillStyle = ink(restAlpha);
          ctx.fillRect(x - 0.5, y - 0.5, 1, 1);

          if (energy <= 0.02) continue;

          // ~4% of cells in each pass are flagged and rendered in the accent.
          const flagged = hash(c, r, pass) > 0.96;
          const size = 2 + energy * (flagged ? 5 : 3.5);

          ctx.fillStyle = flagged ? signal(0.35 + energy * 0.65) : ink(restAlpha + energy * 0.55);
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      // The leading edge of the sweep.
      const edgeX = offsetX + (sweep - 0.5) * CELL;
      if (edgeX > 0 && edgeX < width) {
        const gradient = ctx.createLinearGradient(edgeX, 0, edgeX, height);
        gradient.addColorStop(0, signal(0));
        gradient.addColorStop(0.5, signal(0.5));
        gradient.addColorStop(1, signal(0));
        ctx.fillStyle = gradient;
        ctx.fillRect(edgeX, 0, 1, height);
      }
    };

    const start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    };

    resize();

    if (reduced) {
      // A single settled frame: the same composition, held still.
      draw(3.2);
    } else {
      frame = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw(3.2);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduced, theme]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default SignalGrid;
