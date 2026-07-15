import React, { useState } from "react";
import type { CSSProperties } from "react";

type HoveredItem = "google" | "privacy" | "settings" | null;

interface LoginPageProps {
  googleLogin: () => void;
  loading: boolean;
}

export default function LoginPage({ googleLogin, loading }: LoginPageProps): React.ReactElement {
  const [hovered, setHovered] = useState<HoveredItem>(null);

  return (
    <div style={styles.root}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.logoRing}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" fill="white" opacity="0.9" />
              <path d="M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" fill="none" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <span style={styles.brandName}>Zwigato</span>
        </div>

        <div style={styles.headline}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue to your account</p>
        </div>

        <div style={styles.orderBanner}>
          <div style={styles.orderBannerGlow} />
          <div style={styles.orderBannerInner}>
            <div style={styles.orderTag}>NEW</div>
            <div style={styles.orderText}>
              <span style={styles.orderMain}>Login to Order Now</span>
              <span style={styles.orderSub}>Get exclusive deals when you sign in</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={styles.orderArrow}>
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>continue with</span>
          <div style={styles.dividerLine} />
        </div>

        <button
          onClick={googleLogin}
          disabled={loading}
          onMouseEnter={() => setHovered("google")}
          onMouseLeave={() => setHovered(null)}
          style={{
            ...styles.googleBtn,
            ...(hovered === "google" ? styles.googleBtnHover : {}),
            ...(loading ? styles.googleBtnLoading : {}),
          }}
        >
          {loading ? (
            <div style={styles.spinner} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.24C18.34 15.73 19.6 13.18 19.6 10.23z" fill="#4285F4" />
              <path d="M10 20c2.7 0 4.97-.9 6.62-2.44l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H1.07v2.58A9.99 9.99 0 0010 20z" fill="#34A853" />
              <path d="M4.41 11.91A6.05 6.05 0 014.1 10c0-.66.11-1.3.31-1.91V5.51H1.07A9.99 9.99 0 000 10c0 1.61.39 3.13 1.07 4.49l3.34-2.58z" fill="#FBBC05" />
              <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.97.99 12.7 0 10 0A9.99 9.99 0 001.07 5.51l3.34 2.58C5.2 5.73 7.4 3.98 10 3.98z" fill="#EA4335" />
            </svg>
          )}
          <span style={styles.googleBtnText}>
            {loading ? "Signing in..." : "Sign in with Google"}
          </span>
        </button>

        <p style={styles.terms}>
          By signing in, you agree to our{" "}
          <a href="#" style={styles.termsLink}>Terms of Service</a>
        </p>

        <div style={styles.footer}>
          <a
            href="#"
            style={{
              ...styles.footerLink,
              ...styles.footerLinkRed,
              ...(hovered === "privacy" ? styles.footerLinkRedHover : {}),
            }}
            onMouseEnter={() => setHovered("privacy")}
            onMouseLeave={() => setHovered(null)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1L11 3V6.5C11 9 8.5 11.5 6.5 12C4.5 11.5 2 9 2 6.5V3L6.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M4.5 6.5L6 8L8.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Privacy Policy
          </a>

          <div style={styles.footerDot} />

          <a
            href="#"
            style={{
              ...styles.footerLink,
              ...styles.footerLinkRed,
              ...(hovered === "settings" ? styles.footerLinkRedHover : {}),
            }}
            onMouseEnter={() => setHovered("settings")}
            onMouseLeave={() => setHovered(null)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6.5 1v1.5M6.5 10.5V12M1 6.5h1.5M10.5 6.5H12M2.7 2.7l1.06 1.06M9.24 9.24l1.06 1.06M2.7 10.3l1.06-1.06M9.24 3.76l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Settings
          </a>
        </div>
      </div>

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.08); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.05); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

interface Styles {
  root: CSSProperties;
  blob1: CSSProperties;
  blob2: CSSProperties;
  blob3: CSSProperties;
  card: CSSProperties;
  brand: CSSProperties;
  logoRing: CSSProperties;
  brandName: CSSProperties;
  headline: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  orderBanner: CSSProperties;
  orderBannerGlow: CSSProperties;
  orderBannerInner: CSSProperties;
  orderTag: CSSProperties;
  orderText: CSSProperties;
  orderMain: CSSProperties;
  orderSub: CSSProperties;
  orderArrow: CSSProperties;
  divider: CSSProperties;
  dividerLine: CSSProperties;
  dividerText: CSSProperties;
  googleBtn: CSSProperties;
  googleBtnHover: CSSProperties;
  googleBtnLoading: CSSProperties;
  googleBtnText: CSSProperties;
  spinner: CSSProperties;
  terms: CSSProperties;
  termsLink: CSSProperties;
  footer: CSSProperties;
  footerLink: CSSProperties;
  footerLinkRed: CSSProperties;
  footerLinkRedHover: CSSProperties;
  footerDot: CSSProperties;
}

const styles: Styles = {
  root: {
    
    minHeight: "100vh",
    width:'100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative",
    overflow: "hidden",
    
  },
  blob1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
    top: "-100px",
    left: "-100px",
    animation: "blob1 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)",
    bottom: "-80px",
    right: "-80px",
    animation: "blob2 9s ease-in-out infinite",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
    top: "50%",
    right: "20%",
    animation: "blob3 7s ease-in-out infinite",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 24,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
    animation: "fadeUp 0.6s ease forwards",
    position: "relative",
    zIndex: 1,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logoRing: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(99,102,241,0.5)",
  },
  brandName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  headline: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.8px",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    margin: 0,
    fontFamily: "'Arial', sans-serif",
  },
  orderBanner: {
    position: "relative",
    borderRadius: 14,
    background: "rgba(249,115,22,0.08)",
    border: "1px solid rgba(249,115,22,0.25)",
    padding: "14px 16px",
    marginBottom: 24,
    overflow: "hidden",
  },
  orderBannerGlow: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  orderBannerInner: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  orderTag: {
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1,
    padding: "3px 7px",
    borderRadius: 5,
    fontFamily: "'Arial', sans-serif",
    flexShrink: 0,
  },
  orderText: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  orderMain: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
    fontFamily: "'Arial', sans-serif",
  },
  orderSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontFamily: "'Arial', sans-serif",
  },
  orderArrow: {
    flexShrink: 0,
    opacity: 0.7,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  },
  dividerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontFamily: "'Arial', sans-serif",
    whiteSpace: "nowrap",
  },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "14px 20px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    marginBottom: 16,
  },
  googleBtnHover: {
    background: "#fff",
    transform: "translateY(-1px)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
  },
  googleBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#1a1a2e",
    fontFamily: "'Arial', sans-serif",
    letterSpacing: "-0.2px",
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2px solid rgba(0,0,0,0.15)",
    borderTop: "2px solid #4285F4",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  terms: {
    textAlign: "center",
    fontSize: 11,
    color: "rgba(255,255,255,0.28)",
    marginBottom: 24,
    fontFamily: "'Arial', sans-serif",
    lineHeight: 1.6,
  },
  termsLink: {
    color: "rgba(255,255,255,0.45)",
    textDecoration: "underline",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  footerLink: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    textDecoration: "none",
    fontFamily: "'Arial', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s ease",
    letterSpacing: "0.1px",
  },
  footerLinkRed: {
    color: "#ef4444",
  },
  footerLinkRedHover: {
    color: "#f87171",
    transform: "translateY(-1px)",
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
  },
};