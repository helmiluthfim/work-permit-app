// shared-components.tsx
// Komponen bersama untuk semua tab Work Permit
// Import dari sini di setiap tab

import {
  Briefcase,
  CalendarClock,
  UserSquare2,
  Phone,
  ShieldAlert,
  FileText,
  Lock,
} from "lucide-react";

// ─── Section Card ─────────────────────────────────────────────────────────────
export function SectionCard({
  title,
  icon: Icon,
  badge,
  children,
  accent = "navy",
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
  accent?: "navy" | "red" | "emerald" | "indigo";
}) {
  const accentMap = {
    navy: "bg-[#0F1F3D]/[0.04] border-[#0F1F3D]/10",
    red: "bg-red-50/60 border-red-100",
    emerald: "bg-emerald-50/60 border-emerald-100",
    indigo: "bg-indigo-50/60 border-indigo-100",
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`flex items-center justify-between border-b px-6 py-4 ${accentMap[accent]}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1F3D]/10">
            <Icon size={16} className="text-[#0F1F3D]" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-wide text-[#0F1F3D]">
            {title}
          </h2>
        </div>
        {badge && (
          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Lock size={10} />
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Info Summary Bar (read-only ringkasan dari tab WP) ──────────────────────
export function InfoSummaryBar({
  formData,
  selectedJob,
  selectedPjTeknik,
  selectedAhliK3,
}: {
  formData: any;
  selectedJob?: { kodePekerjaan: string; namaPekerjaan: string } | undefined;
  selectedPjTeknik?: { nama: string } | undefined;
  selectedAhliK3?: { nama: string } | undefined;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#0F1F3D]/10 bg-[#0F1F3D]">
      <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {/* Pekerjaan */}
        <div className="flex gap-3 px-5 py-4">
          <Briefcase size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Pekerjaan
            </p>
            <p className="text-sm font-bold text-white">
              {selectedJob
                ? `${selectedJob.kodePekerjaan} · ${selectedJob.namaPekerjaan}`
                : "—"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {formData.lokasi || "—"}
            </p>
          </div>
        </div>

        {/* Jadwal */}
        <div className="flex gap-3 px-5 py-4">
          <CalendarClock size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
          <div className="space-y-1.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                Mulai
              </p>
              <p className="text-xs font-semibold text-slate-300">
                {formData.tanggalMulai || "—"}{" "}
                <span className="text-slate-500">·</span>{" "}
                {formData.waktuMulai || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
                Selesai
              </p>
              <p className="text-xs font-semibold text-slate-300">
                {formData.tanggalSelesai || "—"}{" "}
                <span className="text-slate-500">·</span>{" "}
                {formData.waktuSelesai || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* PJ Teknik */}
        <div className="flex gap-3 px-5 py-4">
          <UserSquare2 size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              PJ Teknik
            </p>
            <p className="text-sm font-bold text-white">
              {selectedPjTeknik?.nama || "—"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Phone size={10} />
              {formData.noTelpPjTeknik || "—"}
            </p>
          </div>
        </div>

        {/* Ahli K3 */}
        <div className="flex gap-3 px-5 py-4">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-[#F5A623]" />
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">
              Tenaga Ahli K3
            </p>
            <p className="text-sm font-bold text-white">
              {selectedAhliK3?.nama || "—"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Phone size={10} />
              {formData.noTelpTenagaAhliK3 || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Formatted text renderer ─────────────────────────────────────────────────
export function FormattedText({ text }: { text: string }) {
  if (!text)
    return (
      <span className="italic text-slate-400">
        Tidak ada data dari template...
      </span>
    );

  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return null;
        if (/^\d+\./.test(t)) {
          return (
            <p
              key={i}
              className="mt-3 text-xs font-black uppercase tracking-wide text-[#0F1F3D] first:mt-0"
            >
              {t}
            </p>
          );
        }
        return (
          <div
            key={i}
            className="ml-3 flex items-start gap-2 text-sm text-slate-700"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
            <span>{t.replace(/^- /, "")}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Navigation footer ────────────────────────────────────────────────────────
export function NavFooter({
  step,
  totalSteps,
  backLabel,
  nextLabel,
  onBack,
  onNext,
  nextDisabled,
  nextLoading,
  nextVariant = "navy",
}: {
  step: number;
  totalSteps: number;
  backLabel: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  nextVariant?: "navy" | "gold";
}) {
  const nextBg =
    nextVariant === "gold"
      ? "bg-[#F5A623] hover:bg-amber-500 text-[#0F1F3D]"
      : "bg-[#0F1F3D] hover:bg-[#1a3561] text-white";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={nextLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        >
          ← {backLabel}
        </button>
        <p className="hidden text-xs text-slate-400 sm:block">
          Langkah <span className="font-bold text-[#0F1F3D]">{step}</span> dari{" "}
          {totalSteps}
        </p>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold shadow-sm transition hover:-translate-y-px active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${nextBg}`}
      >
        {nextLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Memproses...
          </>
        ) : (
          <>{nextLabel} →</>
        )}
      </button>
    </div>
  );
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F1F3D]" />
      <p className="text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}
