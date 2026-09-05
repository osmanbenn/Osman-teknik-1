export type ServiceStatus = 'kabul' | 'onarimda' | 'hazir' | 'teslim_edildi' | 'iade_iptal';

export interface TimelineItem {
  id: string;
  status: ServiceStatus;
  timestamp: string;
  title: string;
  note?: string;
  updatedBy: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  totalServicesCount: number;
  totalPurchasesTRY?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRecord {
  id: string; // Örn: TR-2026-2157
  customerId: string;
  customerName: string;
  customerPhone: string;

  // Cihaz Bilgileri
  deviceBrand: string; // Apple, Samsung, Xiaomi, etc.
  deviceModel: string; // iPhone 13, Galaxy S23, Redmi Note 12
  imeiOrSerial?: string;
  devicePassword?: string; // Ekran kilidi / PIN
  hasPatternLock?: boolean;
  physicalCondition?: string; // "Kılcal çizikler mevcut, kasa sağlam"

  // Arıza ve Fiyat
  issueDescription: string;
  technicianNotes?: string;
  status: ServiceStatus;
  estimatedCostTRY: number;
  finalCostTRY?: number;
  depositTRY?: number; // Alınan kapora

  // Kur & Maliyet Temeli (İlerleyen Fazlar ve Raporlar için Baştan Hazır)
  partsCostTRY?: number;
  partsCostUSD?: number;
  exchangeRateAtPurchase?: number;
  exchangeRateAtCompletion?: number;

  // Tarihler
  createdAt: string; // Kabul tarihi
  estimatedDeliveryDate?: string;
  completedAt?: string;
  deliveredAt?: string;

  // Fotoğraflar
  photos: string[];

  // Zaman Çizelgesi
  timeline: TimelineItem[];
}

export interface QuickStats {
  todayIntakeCount: number;
  inRepairCount: number;
  readyCount: number;
  monthlyCompletedCount: number;
  todaySalesTotalTRY: number;
  todaySalesCount: number;
  totalStockItemsCount: number;
  criticalStockCount: number;
  todayCashBalanceTRY: number;
  dailyTrend: { day: string; count: number; date: string }[];
}

// --- FAZ 2 TİPLERİ (STOK, POS, KASA, CARİ, TEMALAR) ---

export type StockCategory = 
  | 'ekran' 
  | 'batarya' 
  | 'sarj_aksesuar' 
  | 'koruma_kilif' 
  | 'yedek_parca' 
  | 'kulaklik_ses' 
  | 'diger';

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  brand: string;
  compatibleModel?: string;
  barcode: string;
  stockQuantity: number;
  minStockAlert: number;
  costUSD: number;
  costTRY: number;
  sellPriceTRY: number;
  shelfLocation?: string; // Raf / Çekmece Kodu (Örn: A-2 / Çekmece 3)
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  stockItemId: string;
  name: string;
  barcode: string;
  quantity: number;
  unitPriceTRY: number;
  costTRY: number;
  totalTRY: number;
  isManual?: boolean;
  itemType?: 'product' | 'service';
}

export interface SaleRecord {
  id: string; // SAT-2026-1042
  customerId?: string;
  customerName: string; // "Perakende Müşteri" veya seçilen müşteri
  customerPhone?: string;
  items: SaleItem[];
  subtotalTRY: number;
  discountTRY: number;
  totalAmountTRY: number;
  paymentMethod: 'nakit' | 'kredi_karti' | 'havale_eft' | 'veresiye';
  cashierNote?: string;
  createdAt: string;
}

export interface CashTransaction {
  id: string; // KAS-001
  type: 'gelir' | 'gider';
  category: 'hizli_satis' | 'servis_tahsilat' | 'yedek_parca_alimi' | 'kira_fatura' | 'dükkan_gideri' | 'personel' | 'diger';
  amountTRY: number;
  paymentMethod: 'nakit' | 'kredi_karti' | 'havale';
  description: string;
  referenceId?: string;
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  category: string;
  balanceTRY: number; // Borç / Alacak
  notes?: string;
}

export interface AppThemeConfig {
  id: string;
  name: string;
  description: string;
  badge: string;
  isDark: boolean;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  accentClass: string;
  borderClass: string;
  primaryColorHex: string;
  secondaryColorHex: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'services' 
  | 'inventory' 
  | 'pos' 
  | 'cash' 
  | 'customers' 
  | 'quick-actions' 
  | 'status-view' 
  | 'service-detail' 
  | 'themes' 
  | 'settings';

