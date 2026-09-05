import React from 'react';
import { Wrench, Bell, Sun, Moon, RefreshCw, Smartphone, Zap, Activity, ShieldCheck, Printer } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenQuickActions: () => void;
  onOpenIntake: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenQuickActions,
  onOpenIntake,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  OSMANTEKNİK <span className="text-indigo-600 dark:text-indigo-400">PRO</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ERP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                Tamir Yönetim Sistemi • Kart Tabanlı & Sade
              </p>
            </div>
          </div>

          {/* Desktop Feature Badges (Görseldeki banner özellikleri) */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mobil Uyumlu</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Hızlı İşlemler</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Canlı Veriler</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Güvenli Altyapı</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="header-btn-intake"
              onClick={onOpenIntake}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition shadow-sm"
              title="Yeni Cihaz Kabul"
            >
              <span className="text-base leading-none font-bold">+</span>
              <span>Cihaz Kabul</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="header-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Temayı Değiştir"
              title={darkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="header-notifications"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Bildirimler (3 Hazır Cihaz)"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </button>
            </div>

            {/* Reset Demo Data (Developer friendly) */}
            <button
              id="header-reset-data"
              onClick={() => {
                if (window.confirm('Demo verileri ilk haline döndürülsün mü?')) {
                  onResetData();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden md:block"
              title="Örnek Verileri Sıfırla"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
