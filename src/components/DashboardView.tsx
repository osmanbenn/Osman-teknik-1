import React, { useState } from 'react';
import { 
  Package, 
  Wrench, 
  CheckCircle2, 
  Calendar, 
  UserPlus, 
  Boxes, 
  FileText, 
  ArrowRight,
  Plus,
  Phone,
  Clock,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShoppingCart,
  DollarSign,
  Palette
} from 'lucide-react';
import { QuickStats, ServiceRecord, ActiveTab } from '../types';

interface DashboardViewProps {
  stats: QuickStats;
  recentServices: ServiceRecord[];
  onOpenIntake: () => void;
  onOpenCustomerAdd: () => void;
  onOpenQuickSale: () => void;
  onSelectService: (serviceId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentServices,
  onOpenIntake,
  onOpenCustomerAdd,
  onOpenQuickSale,
  onSelectService,
  setActiveTab
}) => {
  const [timeRange, setTimeRange] = useState<'gunluk' | 'haftalik' | 'aylik'>('haftalik');

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fadeIn">
      {/* Top Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Hoş Geldin, Usta <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Bugünkü dükkân tamir ve satış özeti
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuickSale}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-amber-500/25 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Hızlı Satış Yap</span>
          </button>
          <button
            onClick={onOpenIntake}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Cihaz Girişi</span>
          </button>
        </div>
      </div>

      {/* 5 ÖZET KARTI (Hızlı Satış Eklendi) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* 1. Mor Kart - Bugün Kabul */}
        <div
          id="stat-card-kabul"
          onClick={() => setActiveTab('services')}
          className="group cursor-pointer rounded-2xl p-4 text-white bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Servis</span>
          </div>
          <div className="text-2xl font-black tracking-tight">{stats.todayIntakeCount}</div>
          <div className="text-xs font-semibold text-white/90 mt-0.5">Bugün Kabul</div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform"></div>
        </div>

        {/* 2. Turuncu Kart - Onarımda */}
        <div
          id="stat-card-onarimda"
          onClick={() => setActiveTab('services')}
          className="group cursor-pointer rounded-2xl p-4 text-white bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-orange-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Masa</span>
          </div>
          <div className="text-2xl font-black tracking-tight">{stats.inRepairCount}</div>
          <div className="text-xs font-semibold text-white/90 mt-0.5">Onarımda</div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform"></div>
        </div>

        {/* 3. Yeşil Kart - Hazır */}
        <div
          id="stat-card-hazir"
          onClick={() => setActiveTab('services')}
          className="group cursor-pointer rounded-2xl p-4 text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Teslimat</span>
          </div>
          <div className="text-2xl font-black tracking-tight">{stats.readyCount}</div>
          <div className="text-xs font-semibold text-white/90 mt-0.5">Hazır Cihaz</div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform"></div>
        </div>

        {/* 4. Mavi Kart - Bu Ay Tamir */}
        <div
          id="stat-card-aylik"
          onClick={() => setActiveTab('services')}
          className="group cursor-pointer rounded-2xl p-4 text-white bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Aylık</span>
          </div>
          <div className="text-2xl font-black tracking-tight">{stats.monthlyCompletedCount}</div>
          <div className="text-xs font-semibold text-white/90 mt-0.5">Bu Ay Biten</div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform"></div>
        </div>

        {/* 5. GÜL/AMBER KART - HIZLI SATIŞ (Kullanıcının İstediği) */}
        <div
          id="stat-card-hizli-satis"
          onClick={onOpenQuickSale}
          className="group cursor-pointer col-span-2 sm:col-span-1 rounded-2xl p-4 text-white bg-gradient-to-br from-rose-500 via-pink-600 to-amber-600 shadow-md shadow-rose-500/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/30 tracking-wider">HIZLI SATIŞ</span>
          </div>
          <div className="text-2xl font-black tracking-tight font-mono">
            {(stats.todaySalesTotalTRY || 0).toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-xs font-semibold text-white/90 mt-0.5 flex items-center justify-between">
            <span>{stats.todaySalesCount || 0} Satış</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">POS Aç →</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/15 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform"></div>
        </div>
      </div>

      {/* HIZLI İŞLEMLER GRID'İ */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Hızlı İşlemler</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {/* Cihaz Kabul */}
          <button
            id="quick-action-kabul"
            onClick={onOpenIntake}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md active:scale-95 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">Cihaz Kabul</span>
          </button>

          {/* Hızlı Satış */}
          <button
            id="quick-action-satis"
            onClick={onOpenQuickSale}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-amber-300 dark:border-amber-800/60 hover:border-amber-500 hover:shadow-md active:scale-95 transition text-center group bg-amber-50/20"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 leading-tight">Hızlı Satış</span>
          </button>

          {/* Stok Yönetimi */}
          <button
            id="quick-action-stok"
            onClick={() => setActiveTab('inventory')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md active:scale-95 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">Stok Takibi</span>
          </button>

          {/* Kasa & Nakit */}
          <button
            id="quick-action-kasa"
            onClick={() => setActiveTab('cash')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-md active:scale-95 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">Kasa & Nakit</span>
          </button>

          {/* Müşteri Ekle */}
          <button
            id="quick-action-musteri"
            onClick={onOpenCustomerAdd}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md active:scale-95 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">Müşteri Ekle</span>
          </button>

          {/* Temalar */}
          <button
            id="quick-action-temalar"
            onClick={() => setActiveTab('themes')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md active:scale-95 transition text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">Temalar</span>
          </button>
        </div>
      </div>

      {/* ÖZET BİLGİLER / GRAFİK (Görseldeki Bar Chart tasarımı) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Özet Bilgiler
              <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                Haftalık Tamir Performansı
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Günlere göre tamir edilen ve kabul edilen cihazlar</p>
          </div>

          {/* Time range pills */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('gunluk')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                timeRange === 'gunluk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Günlük
            </button>
            <button
              onClick={() => setTimeRange('haftalik')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                timeRange === 'haftalik'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => setTimeRange('aylik')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                timeRange === 'aylik'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Aylık
            </button>
          </div>
        </div>

        {/* CSS Tabanlı Özel Bar Grafiği */}
        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between h-44 gap-2 sm:gap-4 px-2 border-b border-slate-100 dark:border-slate-700">
            {stats.dailyTrend.map((item, index) => {
              const maxCount = 15;
              const heightPercent = Math.min(100, Math.max(15, (item.count / maxCount) * 100));
              const isHighlight = item.day === 'Per' || item.count === 12;

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on top of bar */}
                  <div className="mb-2 relative">
                    <span
                      className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md transition ${
                        isHighlight
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-110'
                          : 'opacity-0 group-hover:opacity-100 bg-indigo-600 text-white'
                      }`}
                    >
                      {item.count}
                    </span>
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[32px] sm:max-w-[44px] rounded-t-lg transition-all duration-500 relative ${
                      isHighlight
                        ? 'bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-500/30'
                        : 'bg-indigo-200 dark:bg-indigo-950/70 hover:bg-indigo-300 dark:hover:bg-indigo-900'
                    }`}
                  ></div>

                  {/* Day Label */}
                  <span className={`text-xs mt-2 font-medium ${isHighlight ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SON SERVİS HAREKETLERİ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Son Servis Kayıtları</h2>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Tümünü Gör</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentServices.slice(0, 5).map(service => {
            const statusConfig = {
              kabul: { label: 'Kabul', color: 'bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800' },
              onarimda: { label: 'Onarımda', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
              hazir: { label: 'Hazır', color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
              teslim_edildi: { label: 'Teslim Edildi', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200' },
              iade_iptal: { label: 'İade', color: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200' }
            }[service.status];

            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm cursor-pointer transition flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                      {service.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {service.customerName} — {service.deviceBrand} {service.deviceModel}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {service.issueDescription}
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-400">
                    {new Date(service.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
