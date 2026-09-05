import React from 'react';
import { Home, Wrench, Plus, Users, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenIntake: () => void;
  readyCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenIntake,
  readyCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2 relative">
        {/* Ana Sayfa */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Ana Sayfa</span>
        </button>

        {/* Servisler */}
        <button
          id="mobile-nav-services"
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition ${
            activeTab === 'services' || activeTab === 'service-detail'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            <Wrench className="w-5 h-5" />
            {readyCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-full">
                {readyCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Servisler</span>
        </button>

        {/* Center Floating Action Button (+) */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            id="mobile-nav-intake-fab"
            onClick={onOpenIntake}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 active:scale-95 transition"
            aria-label="Cihaz Kabul"
            title="Yeni Cihaz Kabul"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-medium text-indigo-600 dark:text-indigo-400 mt-1">Kabul</span>
        </div>

        {/* Müşteriler */}
        <button
          id="mobile-nav-customers"
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'customers'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1">Müşteriler</span>
        </button>

        {/* Ayarlar / Hızlı İşlemler */}
        <button
          id="mobile-nav-settings"
          onClick={() => setActiveTab('quick-actions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'quick-actions' || activeTab === 'settings'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-1">İşlemler</span>
        </button>
      </div>
    </div>
  );
};
