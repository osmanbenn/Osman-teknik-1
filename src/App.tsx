import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  ServiceRecord, 
  Customer, 
  QuickStats, 
  ServiceStatus,
  StockItem,
  SaleRecord,
  CashTransaction,
  AppThemeConfig
} from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ServicesListView } from './components/ServicesListView';
import { ServiceDetailView } from './components/ServiceDetailView';
import { CustomerStatusView } from './components/CustomerStatusView';
import { CustomersView } from './components/CustomersView';
import { QuickActionsModal } from './components/QuickActionsModal';
import { ServiceIntakeModal } from './components/ServiceIntakeModal';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { SettingsView } from './components/SettingsView';
import { InventoryView } from './components/InventoryView';
import { QuickSaleModal } from './components/QuickSaleModal';
import { StockItemModal } from './components/StockItemModal';
import { CashView } from './components/CashView';
import { ThemesView } from './components/ThemesView';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('osmantechnik_theme') === 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>('TR-2026-2157');
  
  // Veri Katmanı State'leri
  const [services, setServices] = useState<ServiceRecord[]>(() => storageService.getServices());
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  const [stats, setStats] = useState<QuickStats>(() => storageService.getStats());
  const [stockList, setStockList] = useState<StockItem[]>(() => storageService.getStockItems());
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(() => storageService.getCashTransactions());
  const [themes] = useState<AppThemeConfig[]>(() => storageService.getThemes());
  const [activeThemeId, setActiveThemeId] = useState<string>(() => storageService.getActiveThemeId());

  // Modal State'leri
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingStockItem, setEditingStockItem] = useState<StockItem | null>(null);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('osmantechnik_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('osmantechnik_theme', 'light');
    }
  }, [darkMode]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setServices(storageService.getServices());
      setCustomers(storageService.getCustomers());
      setStats(storageService.getStats());
      setStockList(storageService.getStockItems());
      setCashTransactions(storageService.getCashTransactions());
      setActiveThemeId(storageService.getActiveThemeId());
    });
    return unsubscribe;
  }, []);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleSelectService = (id: string) => {
    setSelectedServiceId(id);
    setActiveTab('service-detail');
  };

  const handleStatusUpdate = (id: string, newStatus: ServiceStatus, note?: string) => {
    storageService.updateServiceStatus(id, newStatus, note);
  };

  const handleIntakeSuccess = (newRecord: ServiceRecord) => {
    setIsIntakeOpen(false);
    setSelectedServiceId(newRecord.id);
    setActiveTab('service-detail');
  };

  // FAZ 2: Stok İşlemleri
  const handleSaveStock = (stockData: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingStockItem) {
      storageService.updateStockItem(editingStockItem.id, stockData);
      setEditingStockItem(null);
    } else {
      storageService.addStockItem(stockData);
    }
    setIsStockModalOpen(false);
  };

  const handleDeleteStock = (id: string) => {
    storageService.deleteStockItem(id);
  };

  const handleAdjustStockQuantity = (id: string, delta: number) => {
    storageService.adjustStockQuantity(id, delta);
  };

  // FAZ 2: Hızlı Satış İşlemleri
  const handleCompleteSale = (saleData: Omit<SaleRecord, 'id' | 'createdAt'>) => {
    return storageService.createSaleRecord(saleData);
  };

  // FAZ 2: Kasa İşlemleri
  const handleAddCashTransaction = (txData: Omit<CashTransaction, 'id' | 'date'>) => {
    storageService.addCashTransaction(txData);
  };

  const handleDeleteCashTransaction = (id: string) => {
    storageService.deleteCashTransaction(id);
  };

  // FAZ 2: Tema Değişimi
  const handleSelectTheme = (themeId: string) => {
    storageService.setActiveThemeId(themeId);
    setActiveThemeId(themeId);
    const selectedTheme = themes.find(t => t.id === themeId);
    if (selectedTheme) {
      setDarkMode(selectedTheme.isDark);
    }
  };

  const handleResetData = () => {
    storageService.resetToDefaults();
    setServices(storageService.getServices());
    setCustomers(storageService.getCustomers());
    setStats(storageService.getStats());
    setStockList(storageService.getStockItems());
    setCashTransactions(storageService.getCashTransactions());
    setActiveThemeId('theme_modern_gsm');
    setSelectedServiceId('TR-2026-2157');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenQuickActions={() => setActiveTab('quick-actions')}
        onOpenIntake={() => setIsIntakeOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Responsive Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          intakeCount={stats.todayIntakeCount}
          inRepairCount={stats.inRepairCount}
          readyCount={stats.readyCount}
          onOpenIntake={() => setIsIntakeOpen(true)}
          onOpenQuickSale={() => setIsQuickSaleOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* ANA DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              recentServices={services}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onOpenCustomerAdd={() => setActiveTab('customers')}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
              onSelectService={handleSelectService}
              setActiveTab={setActiveTab}
            />
          )}

          {/* SERVİS LİSTESİ */}
          {activeTab === 'services' && (
            <ServicesListView
              services={services}
              onSelectService={handleSelectService}
              onOpenIntake={() => setIsIntakeOpen(true)}
            />
          )}

          {/* SERVİS DETAY */}
          {activeTab === 'service-detail' && selectedService && (
            <ServiceDetailView
              service={selectedService}
              onBack={() => setActiveTab('services')}
              onOpenStatusUpdate={() => setIsStatusUpdateOpen(true)}
              onOpenEdit={() => setIsIntakeOpen(true)}
              onOpenReceipt={() => setIsReceiptOpen(true)}
              onOpenCustomerStatusView={() => setActiveTab('status-view')}
            />
          )}

          {/* MÜŞTERİ DURUM SAYFASI */}
          {activeTab === 'status-view' && selectedService && (
            <CustomerStatusView
              service={selectedService}
              onBack={() => setActiveTab('service-detail')}
              onOpenReceipt={() => setIsReceiptOpen(true)}
            />
          )}

          {/* MÜŞTERİLER LİSTESİ */}
          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              services={services}
              onSelectCustomerServices={(custId) => setActiveTab('services')}
              onSelectService={handleSelectService}
            />
          )}

          {/* FAZ 2: STOK & YEDEK PARÇA */}
          {activeTab === 'inventory' && (
            <InventoryView
              stockList={stockList}
              onOpenNewStock={() => {
                setEditingStockItem(null);
                setIsStockModalOpen(true);
              }}
              onEditStock={(item) => {
                setEditingStockItem(item);
                setIsStockModalOpen(true);
              }}
              onDeleteStock={handleDeleteStock}
              onAdjustQuantity={handleAdjustStockQuantity}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
            />
          )}

          {/* FAZ 2: POS / HIZLI SATIŞ SEKMESİ */}
          {activeTab === 'pos' && (
            <InventoryView
              stockList={stockList}
              onOpenNewStock={() => {
                setEditingStockItem(null);
                setIsStockModalOpen(true);
              }}
              onEditStock={(item) => {
                setEditingStockItem(item);
                setIsStockModalOpen(true);
              }}
              onDeleteStock={handleDeleteStock}
              onAdjustQuantity={handleAdjustStockQuantity}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
            />
          )}

          {/* FAZ 2: KASA & NAKİT AKIŞI */}
          {activeTab === 'cash' && (
            <CashView
              transactions={cashTransactions}
              onAddTransaction={handleAddCashTransaction}
              onDeleteTransaction={handleDeleteCashTransaction}
            />
          )}

          {/* FAZ 2: TEMALAR BÖLÜMÜ */}
          {activeTab === 'themes' && (
            <ThemesView
              themes={themes}
              activeThemeId={activeThemeId}
              onSelectTheme={handleSelectTheme}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {/* HIZLI İŞLEMLER */}
          {activeTab === 'quick-actions' && (
            <QuickActionsModal
              onClose={() => setActiveTab('dashboard')}
              onOpenIntake={() => setIsIntakeOpen(true)}
              onOpenQuickSale={() => setIsQuickSaleOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {/* AYARLAR */}
          {activeTab === 'settings' && (
            <SettingsView 
              onResetDemo={handleResetData} 
              onOpenThemes={() => setActiveTab('themes')} 
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIntake={() => setIsIntakeOpen(true)}
        readyCount={stats.readyCount}
      />

      {/* MODALS */}
      {/* 1. Yeni Cihaz Kabul Modal */}
      {isIntakeOpen && (
        <ServiceIntakeModal
          onClose={() => setIsIntakeOpen(false)}
          onSuccess={handleIntakeSuccess}
          customers={customers}
        />
      )}

      {/* 2. Durum Güncelleme Modal */}
      {isStatusUpdateOpen && selectedService && (
        <StatusUpdateModal
          service={selectedService}
          onClose={() => setIsStatusUpdateOpen(false)}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* 3. Termal Fiş Yazdırma Modal */}
      {isReceiptOpen && selectedService && (
        <ThermalReceiptModal
          service={selectedService}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}

      {/* 4. FAZ 2: Hızlı Satış & Barkodlu POS Modal */}
      {isQuickSaleOpen && (
        <QuickSaleModal
          stockList={stockList}
          customers={customers}
          onClose={() => setIsQuickSaleOpen(false)}
          onCompleteSale={handleCompleteSale}
          onSaveStockItem={handleSaveStock}
          onAddCustomer={(data) => {
            const newCust = storageService.findOrCreateCustomer(data.fullName, data.phone);
            setCustomers(storageService.getCustomers());
            return newCust;
          }}
        />
      )}

      {/* 5. FAZ 2: Stok & Parça Ekleme/Düzenleme Modal */}
      {isStockModalOpen && (
        <StockItemModal
          item={editingStockItem}
          onClose={() => {
            setIsStockModalOpen(false);
            setEditingStockItem(null);
          }}
          onSave={handleSaveStock}
        />
      )}
    </div>
  );
}
