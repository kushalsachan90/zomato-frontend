import { useEffect, useState, type ReactElement } from "react";

export default function ZwigatoWelcome(): ReactElement {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Outfit:wght@300;400;600&display=swap');

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --bg-primary: #080808;
          --bg-secondary: #111111;
          --accent: #ff5a1e;
          --accent-soft: #ff9a5c;
          --accent-pale: #ffcba4;
          --text-primary: #f5f5f5;
          --text-muted: rgba(255, 255, 255, 0.35);
          --border-subtle: rgba(255, 90, 30, 0.2);
        }

        html, body, #root {
          height: 100%;
          width: 100%;
        }

        /* ── Scrolling food ticker ── */
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Glow pulse ── */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.2); }
        }

        /* ── Floating particles ── */
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(0) scale(0.8); }
          20%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-120px) scale(1.2); }
        }

        /* ── Entrance ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Shimmer on brand name ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── Underline grow ── */
        @keyframes growLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .zwigato-root {
          display: flex;
          flex-direction: row;
          height: 100vh;
          width: 100%;
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
        }

        /* ════════════ LEFT PANEL ════════════ */
        .left-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        /* Grid texture */
        .left-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        /* Radial glow */
        .glow {
          position: absolute;
          width: 640px;
          height: 640px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,90,30,0.18) 0%, transparent 68%);
          top: 50%; left: 50%;
          animation: glowPulse 5s ease-in-out infinite;
          pointer-events: none;
        }

        /* Floating dot particles */
        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          bottom: 10%;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          animation: floatUp 6s ease-in-out infinite;
          opacity: 0;
        }

        .particle:nth-child(1)  { left: 20%; animation-delay: 0s;   animation-duration: 5.5s; }
        .particle:nth-child(2)  { left: 35%; animation-delay: 1.2s; animation-duration: 7s;   }
        .particle:nth-child(3)  { left: 50%; animation-delay: 2.4s; animation-duration: 6s;   }
        .particle:nth-child(4)  { left: 65%; animation-delay: 0.8s; animation-duration: 5s;   }
        .particle:nth-child(5)  { left: 80%; animation-delay: 3s;   animation-duration: 6.5s; }

        /* Corner accents */
        .corner {
          position: absolute;
          width: 36px;
          height: 36px;
          border-color: var(--border-subtle);
          border-style: solid;
          z-index: 3;
        }
        .corner-tl { top: 24px; left: 24px; border-width: 1px 0 0 1px; }
        .corner-tr { top: 24px; right: 24px; border-width: 1px 1px 0 0; }
        .corner-bl { bottom: 24px; left: 24px; border-width: 0 0 1px 1px; }
        .corner-br { bottom: 24px; right: 24px; border-width: 0 1px 1px 0; }

        /* ── Main content ── */
        .hero-content {
          position: relative;
          z-index: 4;
          text-align: center;
          padding: 0 2rem;
          opacity: 0;
        }

        .hero-content.visible {
          animation: slideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
        }

        .eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.45em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .eyebrow::before,
        .eyebrow::after {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--accent);
          opacity: 0.6;
        }

        .welcome-line {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 4vw, 3.8rem);
          color: rgba(255,255,255,0.55);
          letter-spacing: -0.01em;
          display: block;
          line-height: 1;
        }

        .brand-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: clamp(3.8rem, 8vw, 7rem);
          letter-spacing: -0.03em;
          line-height: 1;
          display: block;
          background: linear-gradient(
            120deg,
            var(--accent) 0%,
            var(--accent-soft) 35%,
            var(--accent-pale) 55%,
            var(--accent-soft) 75%,
            var(--accent) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .title-wrapper {
          position: relative;
          display: inline-block;
        }

        .underline-bar {
          display: block;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), transparent);
          margin-top: 6px;
          transform-origin: left;
          transform: scaleX(0);
        }

        .hero-content.visible .underline-bar {
          animation: growLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.9s forwards;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          justify-content: center;
          margin: 28px auto;
        }

        .divider-line {
          width: 48px;
          height: 1px;
          background: var(--border-subtle);
        }

        .divider-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.7;
        }

        .subtitle {
          font-size: 14px;
          font-weight: 300;
          color: var(--text-muted);
          letter-spacing: 0.12em;
          margin-bottom: 40px;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 32px;
          border: 1px solid var(--accent);
          background: transparent;
          color: var(--accent);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease;
        }

        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--accent);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .cta-btn:hover::before {
          transform: translateX(0);
        }

        .cta-btn:hover {
          color: #000;
        }

        .cta-btn span {
          position: relative;
          z-index: 1;
        }

        .cta-arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .cta-btn:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* ════════════ TICKER STRIP ════════════ */
        .ticker-strip {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 36px;
          background: var(--accent);
          display: flex;
          align-items: center;
          overflow: hidden;
          z-index: 5;
        }

        .ticker-track {
          display: flex;
          gap: 0;
          animation: ticker 18s linear infinite;
          white-space: nowrap;
          will-change: transform;
        }

        .ticker-item {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #000;
          padding: 0 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ticker-sep {
          opacity: 0.4;
          font-size: 14px;
        }
      `}</style>

      <div className="zwigato-root">
        {/* ── Left Panel ── */}
        <div className="left-panel">
          <div className="glow" />

          <div className="particles">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="particle" />
            ))}
          </div>

          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          <div className={`hero-content ${visible ? "visible" : ""}`}>
            <p className="eyebrow">Food Delivery</p>

            <div className="title-wrapper">
              <span className="welcome-line">Welcome to</span>
              <span className="brand-name">Zwigato</span>
              <span className="underline-bar" />
            </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-dot" />
              <span className="divider-line" />
            </div>

            <p className="subtitle">Cravings met. Delivered fast.</p>

            <button className="cta-btn">
              <span>Order Now</span>
              <svg
                className="cta-arrow"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Ticker strip */}
          <div className="ticker-strip">
            <div className="ticker-track">
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{ display: "flex" }}>
                  {[
                    "🍕 Pizza",
                    "🍔 Burgers",
                    "🌮 Tacos",
                    "🍜 Noodles",
                    "🥗 Salads",
                    "🍣 Sushi",
                    "🍛 Curry",
                    "🥤 Drinks",
                  ].map((item, j) => (
                    <span key={j} className="ticker-item">
                      {item}
                      <span className="ticker-sep">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}