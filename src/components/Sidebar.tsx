import React from 'react';
import { 
  Home, 
  Wrench, 
  Users, 
  ShoppingCart, 
  Boxes, 
  DollarSign, 
  Palette, 
  Settings, 
  PlusCircle, 
  CheckCircle, 
  Package 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  intakeCount: number;
  inRepairCount: number;
  readyCount: number;
  onOpenIntake: () => void;
  onOpenQuickSale?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  intakeCount,
  inRepairCount,
  readyCount,
  onOpenIntake,
  onOpenQuickSale
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Ana Sayfa', icon: Home },
    {
      id: 'services' as ActiveTab,
      label: 'Servisler',
      icon: Wrench,
      badge: intakeCount + inRepairCount + readyCount
    },
    { id: 'pos' as ActiveTab, label: 'Hızlı Satış (POS)', icon: ShoppingCart },
    { id: 'inventory' as ActiveTab, label: 'Stok & Parça', icon: Boxes },
    { id: 'cash' as ActiveTab, label: 'Kasa & Nakit', icon: DollarSign },
    { id: 'customers' as ActiveTab, label: 'Müşteriler', icon: Users },
    { id: 'themes' as ActiveTab, label: 'Temalar', icon: Palette },
    { id: 'settings' as ActiveTab, label: 'Ayarlar', icon: Settings }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    if (tabId === 'pos' && onOpenQuickSale) {
      onOpenQuickSale();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0 transition-colors">
      {/* Quick Intake Button */}
      <button
        id="sidebar-intake-btn"
        onClick={onOpenIntake}
        className="w-full mb-6 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/25 transition"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Yeni Cihaz Kabul</span>
      </button>

      {/* Navigation List */}
      <nav className="space-y-1.5 flex-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Quick Status summary */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
            Kabul
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{intakeCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Onarımda
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{inRepairCount}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Hazır
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-semibold">{readyCount}</span>
        </div>
      </div>
    </aside>
  );
};
