"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, X, FileText } from "lucide-react";

interface INotification {
  _id: string;
  title: string;
  message: string;
  type: "SUBMIT" | "APPROVE" | "REJECT" | "RATIFY";
  isRead: boolean;
  createdAt: string;
}

const typeStyles: Record<
  INotification["type"],
  { border: string; progress: string; icon: string }
> = {
  SUBMIT: {
    border: "border-blue-500",
    progress: "bg-blue-500",
    icon: "text-blue-500",
  },
  APPROVE: {
    border: "border-green-500",
    progress: "bg-green-500",
    icon: "text-green-500",
  },
  REJECT: {
    border: "border-red-500",
    progress: "bg-red-500",
    icon: "text-red-500",
  },
  RATIFY: {
    border: "border-amber-500",
    progress: "bg-amber-500",
    icon: "text-amber-500",
  },
};

const TOAST_DURATION = 5000; // 5 detik

interface ToastItem extends INotification {
  toastId: string;
  progress: number;
}

export default function NotificationToast() {
  const { data: session, status } = useSession();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  /* ── Ambil notifikasi terbaru ── */
  async function fetchLatestNotifications(isFirstLoad = false) {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();

      if (!data.notifications || data.notifications.length === 0) return;

      const latest: INotification[] = data.notifications;

      if (isFirstLoad) {
        // Saat pertama login — tampilkan notif yang belum dibaca
        const unread = latest.filter((n) => !n.isRead);
        if (unread.length > 0) {
          showToasts(unread.slice(0, 3)); // maksimal 3 toast sekaligus
        }
        setLastChecked(latest[0].createdAt);
        setHasInitialized(true);
        return;
      }

      // Polling — tampilkan hanya notif yang lebih baru dari lastChecked
      if (!lastChecked) return;
      const newNotifs = latest.filter(
        (n) => new Date(n.createdAt) > new Date(lastChecked) && !n.isRead,
      );

      if (newNotifs.length > 0) {
        showToasts(newNotifs);
        setLastChecked(newNotifs[0].createdAt);
      }
    } catch (err) {
      console.error("Toast fetch error:", err);
    }
  }

  /* ── Tampilkan toast ── */
  function showToasts(notifications: INotification[]) {
    const newToasts: ToastItem[] = notifications.map((n) => ({
      ...n,
      toastId: `${n._id}-${Date.now()}`,
      progress: 100,
    }));
    setToasts((prev) => [...newToasts, ...prev].slice(0, 5)); // max 5 toast
  }

  /* ── Hapus satu toast ── */
  function dismissToast(toastId: string) {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  }

  /* ── Jalankan saat session siap ── */
  useEffect(() => {
    if (status !== "authenticated") return;
    fetchLatestNotifications(true);
  }, [status]);

  /* ── Polling setiap 30 detik ── */
  useEffect(() => {
    if (!hasInitialized) return;
    const interval = setInterval(() => {
      fetchLatestNotifications(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [hasInitialized, lastChecked]);

  /* ── Progress bar timer per toast ── */
  useEffect(() => {
    if (toasts.length === 0) return;

    const interval = setInterval(() => {
      setToasts((prev) =>
        prev
          .map((t) => ({
            ...t,
            progress: t.progress - 100 / (TOAST_DURATION / 100),
          }))
          .filter((t) => t.progress > 0),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [toasts.length]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const style = typeStyles[toast.type];
        return (
          <div
            key={toast.toastId}
            className={[
              "relative w-80 overflow-hidden rounded-xl border-l-4 bg-white shadow-xl",
              "duration-300 animate-in slide-in-from-right-5",
              style.border,
            ].join(" ")}
          >
            {/* Konten */}
            <div className="flex items-start gap-3 px-4 py-3.5">
              {/* Icon */}
              <div
                className={[
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100",
                  style.icon,
                ].join(" ")}
              >
                <FileText size={15} />
              </div>

              {/* Teks */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-black leading-tight text-[#0F1F3D]">
                    {toast.title}
                  </p>
                  <button
                    onClick={() => dismissToast(toast.toastId)}
                    className="shrink-0 text-slate-300 transition hover:text-slate-500"
                  >
                    <X size={13} />
                  </button>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                  {toast.message}
                </p>
              </div>
            </div>

            {/* Progress bar timer */}
            <div className="h-1 w-full bg-slate-100">
              <div
                className={[
                  "h-full transition-all duration-100",
                  style.progress,
                ].join(" ")}
                style={{ width: `${toast.progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
