import { Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative h-screen overflow-hidden bg-[#0F1F3D] font-sans text-white">
      <style>{`
        .stripe-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 32px,
            rgba(255,255,255,0.025) 32px,
            rgba(255,255,255,0.025) 34px
          );
          pointer-events: none;
        }
        .cta-btn:hover {
          background: #e09410;
          transform: translateY(-2px);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .float { animation: float 4s ease-in-out infinite; }
        .float-slow { animation: float-slow 6s ease-in-out infinite; }
      `}</style>

      {/* ── BACKGROUND: diagonal yellow panel ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Yellow panel */}
        <div
          className="absolute right-0 top-0 h-full w-[52%]"
          style={{ clipPath: "polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        >
          {/* Base yellow */}
          <div className="absolute inset-0 bg-[#F5A623]" />
          {/* Depth gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,31,61,0.5) 0%, rgba(15,31,61,0.08) 55%, transparent 100%)",
            }}
          />
          {/* Subtle stripe texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-55deg, transparent, transparent 20px, rgba(0,0,0,0.15) 20px, rgba(0,0,0,0.15) 22px)",
            }}
          />
        </div>
      </div>

      {/* ── RIGHT PANEL: floating K3 icons ── */}
      <div
        className="stripe-overlay absolute right-0 top-0 z-10 hidden h-full items-center justify-center md:flex"
        style={{ width: "50%" }}
        aria-hidden="true"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Helm — center, floating */}
          <div
            className="float absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -58%)",
            }}
          >
            <svg width="180" height="158" viewBox="0 0 160 140" fill="none">
              {/* Shadow */}
              <ellipse
                cx="80"
                cy="118"
                rx="55"
                ry="8"
                fill="rgba(15,31,61,0.25)"
              />
              {/* Helm body */}
              <path
                d="M20 80 C20 38 140 38 140 80 L140 94 C140 100 134 106 128 106 L32 106 C26 106 20 100 20 94 Z"
                fill="#0F1F3D"
              />
              {/* Stripe highlight */}
              <path
                d="M30 78 C30 44 130 44 130 78"
                stroke="#F5A623"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Brim */}
              <rect
                x="12"
                y="90"
                width="136"
                height="11"
                rx="5.5"
                fill="#0F1F3D"
              />
              <rect
                x="12"
                y="90"
                width="136"
                height="11"
                rx="5.5"
                fill="rgba(245,166,35,0.15)"
              />
              {/* Visor curve */}
              <path
                d="M36 83 Q80 70 124 83"
                stroke="#F5A623"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Top vent dots */}
              <circle cx="72" cy="50" r="3" fill="rgba(245,166,35,0.4)" />
              <circle cx="80" cy="46" r="3" fill="rgba(245,166,35,0.4)" />
              <circle cx="88" cy="50" r="3" fill="rgba(245,166,35,0.4)" />
            </svg>
          </div>

          {/* Shield — bottom left of center */}
          <div
            className="float-slow absolute"
            style={{ bottom: "22%", left: "14%" }}
          >
            <svg width="80" height="90" viewBox="0 0 90 100" fill="none">
              <path
                d="M45 4 L80 18 L80 52 C80 72 62 88 45 96 C28 88 10 72 10 52 L10 18 Z"
                fill="#0F1F3D"
                stroke="#F5A623"
                strokeWidth="3"
              />
              <path
                d="M28 50 L40 62 L62 38"
                stroke="#F5A623"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Warning triangle — top right of center */}
          <div
            className="float absolute"
            style={{ top: "18%", right: "18%", animationDelay: "1s" }}
          >
            <svg width="64" height="58" viewBox="0 0 64 58" fill="none">
              <path
                d="M32 4 L60 52 H4 Z"
                fill="#0F1F3D"
                stroke="#F5A623"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <text
                x="32"
                y="42"
                textAnchor="middle"
                fontSize="22"
                fontWeight="900"
                fill="#F5A623"
              >
                !
              </text>
            </svg>
          </div>

          {/* Safety First label */}
          <div
            className="absolute bottom-[16%] right-[10%] rounded-full border border-[#0F1F3D]/20 bg-[#0F1F3D]/30 px-5 py-2 backdrop-blur-sm"
            style={{ animationDelay: "2s" }}
          >
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0F1F3D]">
              Safety First
            </span>
          </div>

          {/* Decorative ring — background */}
          <div
            className="absolute rounded-full border-2 border-[#0F1F3D]/10"
            style={{
              width: "320px",
              height: "320px",
              top: "50%",
              left: "50%",
              transform: "translate(-44%, -52%)",
            }}
          />
          <div
            className="absolute rounded-full border border-[#0F1F3D]/06"
            style={{
              width: "420px",
              height: "420px",
              top: "50%",
              left: "50%",
              transform: "translate(-44%, -52%)",
            }}
          />
        </div>
      </div>

      {/* ── LEFT PANEL: main content ── */}
      <div className="relative z-20 flex h-screen w-full flex-col justify-center px-8 md:w-[55%] md:px-16 lg:px-24">
        {/* Company badge */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5A623]">
            <Shield size={15} color="#0F1F3D" strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#F5A623]">
            PT Eksavindo Mitra Mandiri
          </span>
        </div>

        {/* Eyebrow */}
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#F5A623]/70">
          Portal K3 Resmi
        </p>

        {/* Headline */}
        <h1 className="mb-4 text-5xl font-black leading-[1.04] tracking-tight text-white lg:text-[3.6rem]">
          Sistem
          <br />
          <span className="text-[#F5A623]">Perizinan</span>
          <br />
          Kerja K3
        </h1>

        {/* Accent divider */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-1 w-14 rounded-full bg-[#F5A623]" />
          <div className="h-1 w-3 rounded-full bg-[#F5A623]/30" />
        </div>

        {/* Subtitle */}
        <p className="mb-8 max-w-[380px] text-[0.95rem] leading-relaxed text-white/55">
          Portal terpusat untuk pengelolaan izin kerja, pengawasan keselamatan,
          dan kepatuhan prosedur K3 di seluruh area operasional.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="cta-btn inline-flex items-center gap-3 rounded-lg bg-[#F5A623] px-7 py-3.5 text-sm font-black uppercase tracking-wider text-[#0F1F3D] transition duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 9h12M10 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Masuk ke Sistem
          </Link>

          {/* Status pill */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#F5A623]/30 px-4 py-2 text-sm text-white/50">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-400" />
            Sistem Aktif
          </span>
        </div>

        {/* Stats row — hanya muncul di mobile karena panel kanan tersembunyi */}
        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 md:hidden">
          {[
            { value: "100%", label: "Kepatuhan SOP" },
            { value: "24/7", label: "Pemantauan" },
            { value: "Zero", label: "Target KLL" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-lg font-black text-[#F5A623]">
                {s.value}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-white/35">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-8 text-[11px] tracking-widest text-white/25">
          © {new Date().getFullYear()} PT Eksavindo Mitra Mandiri · K3
          Management System
        </p>
      </div>
    </main>
  );
}
