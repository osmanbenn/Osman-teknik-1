import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, ChevronRight, Phone, MessageSquare, ArrowUpDown, X } from 'lucide-react';
import { ServiceRecord, ServiceStatus } from '../types';

interface ServicesListViewProps {
  services: ServiceRecord[];
  onSelectService: (serviceId: string) => void;
  onOpenIntake: () => void;
  initialFilter?: ServiceStatus | 'all';
}

export const ServicesListView: React.FC<ServicesListViewProps> = ({
  services,
  onSelectService,
  onOpenIntake,
  initialFilter = 'all'
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ServiceStatus | 'all'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc'>('date_desc');

  // Sayısal filtre rozetleri
  const counts = useMemo(() => {
    return {
      all: services.length,
      kabul: services.filter(s => s.status === 'kabul').length,
      onarimda: services.filter(s => s.status === 'onarimda').length,
      hazir: services.filter(s => s.status === 'hazir').length,
      teslim_edildi: services.filter(s => s.status === 'teslim_edildi').length
    };
  }, [services]);

  // Filtreleme ve Arama
  const filteredServices = useMemo(() => {
    return services
      .filter(s => {
        // Durum Filtresi
        if (selectedFilter !== 'all' && s.status !== selectedFilter) {
          return false;
        }

        // Metin Araması
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = s.id.toLowerCase().includes(q);
          const matchCustomer = s.customerName.toLowerCase().includes(q);
          const matchPhone = s.customerPhone.includes(q);
          const matchModel = `${s.deviceBrand} ${s.deviceModel}`.toLowerCase().includes(q);
          const matchIssue = s.issueDescription.toLowerCase().includes(q);
          const matchImei = (s.imeiOrSerial || '').toLowerCase().includes(q);

          return matchId || matchCustomer || matchPhone || matchModel || matchIssue || matchImei;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [services, selectedFilter, searchQuery, sortBy]);

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case 'kabul':
        return {
          label: 'Kabul',
          className: 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800'
        };
      case 'onarimda':
        return {
          label: 'Onarımda',
          className: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
      case 'hazir':
        return {
          label: 'Hazır',
          className: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'teslim_edildi':
        return {
          label: 'Teslim Edildi',
          className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        };
      case 'iade_iptal':
        return {
          label: 'İade',
          className: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200'
        };
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Servisler
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Toplam {services.length} kayıtlı servis işlemi
          </p>
        </div>
        <button
          id="services-intake-btn"
          onClick={onOpenIntake}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kabul</span>
        </button>
      </div>

      {/* FILTER PILLS (Görseldeki gibi: Kabul (12), Onarımda (7), Hazır (5)) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          id="filter-kabul"
          onClick={() => setSelectedFilter(selectedFilter === 'kabul' ? 'all' : 'kabul')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'kabul'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Kabul</span>
          <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === 'kabul' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {counts.kabul}
          </span>
        </button>

        <button
          id="filter-onarimda"
          onClick={() => setSelectedFilter(selectedFilter === 'onarimda' ? 'all' : 'onarimda')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'onarimda'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Onarımda</span>
          <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === 'onarimda' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {counts.onarimda}
          </span>
        </button>

        <button
          id="filter-hazir"
          onClick={() => setSelectedFilter(selectedFilter === 'hazir' ? 'all' : 'hazir')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            selectedFilter === 'hazir'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Hazır</span>
          <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === 'hazir' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {counts.hazir}
          </span>
        </button>

        <button
          id="filter-all"
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
            selectedFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Tümü ({counts.all})</span>
        </button>
      </div>

      {/* SEARCH BAR & QUICK SORT */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="service-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Ara: Müşteri, Model, Sorun, Takip No..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setSortBy(sortBy === 'date_desc' ? 'date_asc' : 'date_desc')}
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          title={sortBy === 'date_desc' ? 'Yeniden Eskiye' : 'Eskiden Yeniye'}
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* LIST OF SERVICE CARDS (Görseldeki kart yapısı) */}
      <div className="space-y-2.5">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Filter className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sonuç bulunamadı</p>
            <p className="text-xs text-slate-500 mt-1">Arama kriterlerinizi veya filtreyi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          filteredServices.map(service => {
            const badge = getStatusBadge(service.status);
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                onClick={() => onSelectService(service.id)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm active:scale-[0.99] cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Service ID & Status Badge */}
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <span className="font-mono font-extrabold text-sm text-indigo-600 dark:text-indigo-400 tracking-tight">
                      {service.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Customer Name & Model */}
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {service.customerName} — {service.deviceBrand} {service.deviceModel}
                  </div>

                  {/* Issue Description */}
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="truncate">{service.issueDescription}</span>
                  </div>
                </div>

                {/* Right side info (Price & Date) */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
                  <div className="text-xs text-slate-400">
                    {new Date(service.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    {service.finalCostTRY || service.estimatedCostTRY} TL
                  </div>
                  <div className="hidden sm:flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-0.5 transition">
                    <span>Detay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
