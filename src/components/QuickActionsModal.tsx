import React from 'react';
import { 
  ArrowLeft, 
  Package, 
  ShoppingCart, 
  Boxes, 
  Users, 
  Repeat, 
  CreditCard, 
  BarChart3, 
  Settings,
  Sparkles,
  Info,
  Palette
} from 'lucide-react';
import { ActiveTab } from '../types';

interface QuickActionsModalProps {
  onClose: () => void;
  onOpenIntake: () => void;
  onOpenQuickSale?: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  onClose,
  onOpenIntake,
  onOpenQuickSale,
  setActiveTab
}) => {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showPhaseNotice = (phaseName: string, phaseNumber: number) => {
    setToastMessage(`ℹ️ "${phaseName}" modülü FAZ ${phaseNumber} kapsamında adım adım inşa edilecektir.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const actionItems = [
    {
      id: 'kabul',
      title: 'Cihaz Kabul',
      color: 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/20 text-white',
      icon: Package,
      phase: 1,
      onClick: () => {
        onClose();
        onOpenIntake();
      }
    },
    {
      id: 'satis',
      title: 'Hızlı Satış',
      color: 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-orange-500/20 text-white',
      icon: ShoppingCart,
      phase: 2,
      onClick: () => {
        onClose();
        if (onOpenQuickSale) onOpenQuickSale();
      }
    },
    {
      id: 'stok',
      title: 'Stok Yönetimi',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20 text-white',
      icon: Boxes,
      phase: 2,
      onClick: () => {
        onClose();
        setActiveTab('inventory');
      }
    },
    {
      id: 'kasa',
      title: 'Kasa & Nakit',
      color: 'bg-gradient-to-br from-cyan-600 to-teal-700 shadow-cyan-500/20 text-white',
      icon: CreditCard,
      phase: 2,
      onClick: () => {
        onClose();
        setActiveTab('cash');
      }
    },
    {
      id: 'cari',
      title: 'Cari & Müşteri',
      color: 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20 text-white',
      icon: Users,
      phase: 2,
      onClick: () => {
        onClose();
        setActiveTab('customers');
      }
    },
    {
      id: 'temalar',
      title: 'Temalar',
      color: 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-purple-500/20 text-white',
      icon: Palette,
      phase: 2,
      onClick: () => {
        onClose();
        setActiveTab('themes');
      }
    },
    {
      id: 'ikinci_el',
      title: '2. El Alım',
      color: 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-pink-500/20 text-white',
      icon: Repeat,
      phase: 3,
      onClick: () => showPhaseNotice('2. El Alım & IMEI Kayıt', 3)
    },
    {
      id: 'raporlar',
      title: 'Raporlar',
      color: 'bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-500/20 text-white',
      icon: BarChart3,
      phase: 5,
      onClick: () => showPhaseNotice('Net Kâr & Raporlama', 5)
    },
    {
      id: 'ayarlar',
      title: 'Ayarlar',
      color: 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-slate-500/20 text-white',
      icon: Settings,
      phase: 5,
      onClick: () => {
        onClose();
        setActiveTab('settings');
      }
    }
  ];

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20 md:pb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Hızlı İşlemler
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">İhtiyacın olan işlemi seç</p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 shrink-0 text-indigo-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 8-GRID ACTIONS (Görseldeki 5. Ekran) */}
      <div className="grid grid-cols-2 gap-3.5 pt-2">
        {actionItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`quick-action-grid-${item.id}`}
              onClick={item.onClick}
              className={`p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-md hover:scale-[1.03] active:scale-[0.97] transition relative overflow-hidden group ${item.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-extrabold tracking-wide">{item.title}</span>

              {/* Faz Rozeti */}
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/20 text-white/90">
                FAZ {item.phase}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
