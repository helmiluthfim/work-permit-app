import { Activity } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Lingkaran luar yang berputar */}
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
        {/* Ikon di tengah */}
        <Activity className="h-6 w-6 text-blue-600" />
      </div>
      <p className="animate-pulse text-sm font-medium text-gray-500">
        Menyiapkan Dashboard...
      </p>
    </div>
  );
}
