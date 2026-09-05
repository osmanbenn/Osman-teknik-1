import { 
  Customer, 
  ServiceRecord, 
  ServiceStatus, 
  QuickStats, 
  TimelineItem,
  StockItem,
  SaleRecord,
  SaleItem,
  CashTransaction,
  Supplier,
  AppThemeConfig
} from '../types';

const SERVICES_STORAGE_KEY = 'osmantechnik_services_v1';
const CUSTOMERS_STORAGE_KEY = 'osmantechnik_customers_v1';
const COUNTER_STORAGE_KEY = 'osmantechnik_counter_v1';
const STOCK_STORAGE_KEY = 'osmantechnik_stock_v1';
const SALES_STORAGE_KEY = 'osmantechnik_sales_v1';
const CASH_STORAGE_KEY = 'osmantechnik_cash_v1';
const SUPPLIERS_STORAGE_KEY = 'osmantechnik_suppliers_v1';
const ACTIVE_THEME_STORAGE_KEY = 'osmantechnik_theme_id_v1';

// Başlangıç Mock Fotoğrafları (Kabul fotoğrafları için yüksek kaliteli mockup görselleri)
const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop&q=80'
];

export const APP_THEMES: AppThemeConfig[] = [
  {
    id: 'modern',
    name: 'Modern GSM (Lacivert)',
    description: 'Klasik kurumsal GSM standardı, canlı indigo & lacivert vurgular',
    badge: 'Varsayılan',
    isDark: false,
    bgClass: 'from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20',
    cardBgClass: 'bg-white dark:bg-slate-900',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    accentClass: 'bg-indigo-600 text-white hover:bg-indigo-700',
    borderClass: 'border-indigo-500',
    primaryColorHex: '#4f46e5',
    secondaryColorHex: '#6366f1'
  },
  {
    id: 'cyber',
    name: 'Siber Teknisyen (Zümrüt)',
    description: 'Yüksek kontrastlı zümrüt neon, usta lehimleme tezgahı atmosferi',
    badge: 'Teknik',
    isDark: true,
    bgClass: 'from-slate-950 via-zinc-950 to-emerald-950/30',
    cardBgClass: 'bg-zinc-900/90',
    textClass: 'text-emerald-400',
    accentClass: 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20',
    borderClass: 'border-emerald-500',
    primaryColorHex: '#059669',
    secondaryColorHex: '#10b981'
  },
  {
    id: 'amber',
    name: 'Usta Tezgahı (Sıcak Amber)',
    description: 'Sıcak amber ve ahşap tonları, göz yormayan samimi dükkân hissiyatı',
    badge: 'Klasik',
    isDark: false,
    bgClass: 'from-amber-50/40 via-stone-50 to-orange-50/30 dark:from-stone-950 dark:to-amber-950/20',
    cardBgClass: 'bg-white dark:bg-stone-900',
    textClass: 'text-amber-600 dark:text-amber-400',
    accentClass: 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-500/20',
    borderClass: 'border-amber-500',
    primaryColorHex: '#d97706',
    secondaryColorHex: '#f59e0b'
  },
  {
    id: 'titanium',
    name: 'Titanyum Grafit (Mavi)',
    description: 'Apple Titanyum yüzey esintisi, rafine metalik gri ve okyanus mavisi',
    badge: 'Premium',
    isDark: true,
    bgClass: 'from-slate-900 via-slate-950 to-blue-950/30',
    cardBgClass: 'bg-slate-900/90',
    textClass: 'text-cyan-400',
    accentClass: 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20',
    borderClass: 'border-cyan-500',
    primaryColorHex: '#0284c7',
    secondaryColorHex: '#38bdf8'
  },
  {
    id: 'amoled',
    name: 'Saf Siyah (Amoled Mor)',
    description: 'Derin OLED siyah zemin, elektrik mor ve fuşya aksiyon detayları',
    badge: 'OLED',
    isDark: true,
    bgClass: 'from-black via-zinc-950 to-purple-950/40',
    cardBgClass: 'bg-black/90 border-zinc-800',
    textClass: 'text-fuchsia-400',
    accentClass: 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-fuchsia-500/20',
    borderClass: 'border-fuchsia-500',
    primaryColorHex: '#c026d3',
    secondaryColorHex: '#d946ef'
  }
];

const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stk-1',
    name: 'iPhone 13 Orijinal Revize OLED Ekran',
    category: 'ekran',
    brand: 'Apple',
    compatibleModel: 'iPhone 13 / 13 Pro',
    barcode: '869001001001',
    stockQuantity: 4,
    minStockAlert: 2,
    costUSD: 68.5,
    costTRY: 2400,
    sellPriceTRY: 3850,
    shelfLocation: 'A1-Çekmece 1',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'stk-2',
    name: 'iPhone 11 Deji Yüksek Kapasite Batarya',
    category: 'batarya',
    brand: 'Apple',
    compatibleModel: 'iPhone 11',
    barcode: '869001001002',
    stockQuantity: 8,
    minStockAlert: 3,
    costUSD: 18.5,
    costTRY: 650,
    sellPriceTRY: 1450,
    shelfLocation: 'B2-Kutu 4',
    createdAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-08-22T09:00:00Z'
  },
  {
    id: 'stk-3',
    name: 'Samsung Galaxy A54 Şarj Bordu & Entegre Flex',
    category: 'yedek_parca',
    brand: 'Samsung',
    compatibleModel: 'Galaxy A54 5G',
    barcode: '869001001003',
    stockQuantity: 3,
    minStockAlert: 2,
    costUSD: 10.0,
    costTRY: 350,
    sellPriceTRY: 850,
    shelfLocation: 'C1-Çekmece 2',
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  },
  {
    id: 'stk-4',
    name: 'Apple 20W USB-C Orijinal Hızlı Şarj Adaptörü',
    category: 'sarj_aksesuar',
    brand: 'Apple',
    compatibleModel: 'Tüm iPhone Modelleri',
    barcode: '869001002001',
    stockQuantity: 12,
    minStockAlert: 4,
    costUSD: 12.0,
    costTRY: 420,
    sellPriceTRY: 890,
    shelfLocation: 'Vitrinde Askı 1',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-23T12:00:00Z'
  },
  {
    id: 'stk-5',
    name: 'Samsung 25W Type-C Süper Hızlı Şarj Başlığı',
    category: 'sarj_aksesuar',
    brand: 'Samsung',
    compatibleModel: 'Galaxy S21/S22/S23/A serisi',
    barcode: '869001002002',
    stockQuantity: 7,
    minStockAlert: 3,
    costUSD: 9.0,
    costTRY: 315,
    sellPriceTRY: 690,
    shelfLocation: 'Vitrinde Askı 2',
    createdAt: '2026-08-15T11:00:00Z',
    updatedAt: '2026-08-23T10:00:00Z'
  },
  {
    id: 'stk-6',
    name: 'iPhone 13/14 9D Tam Kaplayan Hayalet Ekran Koruyucu',
    category: 'koruma_kilif',
    brand: 'Apple',
    compatibleModel: 'iPhone 13 / 14',
    barcode: '869001003001',
    stockQuantity: 25,
    minStockAlert: 10,
    costUSD: 1.5,
    costTRY: 52,
    sellPriceTRY: 250,
    shelfLocation: 'Cam Standı 1',
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-23T14:00:00Z'
  },
  {
    id: 'stk-7',
    name: 'Xiaomi Redmi Note 12 Kırılmaz Cam',
    category: 'koruma_kilif',
    brand: 'Xiaomi',
    compatibleModel: 'Redmi Note 12',
    barcode: '869001003002',
    stockQuantity: 15,
    minStockAlert: 5,
    costUSD: 1.2,
    costTRY: 42,
    sellPriceTRY: 200,
    shelfLocation: 'Cam Standı 2',
    createdAt: '2026-08-18T10:30:00Z',
    updatedAt: '2026-08-23T14:00:00Z'
  },
  {
    id: 'stk-8',
    name: 'MagSafe Şeffaf Darbe Emici Silikon Kılıf',
    category: 'koruma_kilif',
    brand: 'Apple',
    compatibleModel: 'iPhone 13 / 14 / 15',
    barcode: '869001003003',
    stockQuantity: 18,
    minStockAlert: 5,
    costUSD: 3.5,
    costTRY: 120,
    sellPriceTRY: 350,
    shelfLocation: 'Kılıf Askısı 3',
    createdAt: '2026-08-19T09:00:00Z',
    updatedAt: '2026-08-23T15:00:00Z'
  },
  {
    id: 'stk-9',
    name: 'Type-C to Lightning Örgülü Hızlı Şarj Kablosu (1.2m)',
    category: 'sarj_aksesuar',
    brand: 'Universal',
    compatibleModel: 'iPhone',
    barcode: '869001002003',
    stockQuantity: 22,
    minStockAlert: 6,
    costUSD: 2.5,
    costTRY: 88,
    sellPriceTRY: 250,
    shelfLocation: 'Kablo Sepeti',
    createdAt: '2026-08-19T11:00:00Z',
    updatedAt: '2026-08-23T15:00:00Z'
  },
  {
    id: 'stk-10',
    name: 'TWS Bluetooth 5.3 ANC Kablosuz Kulaklık',
    category: 'kulaklik_ses',
    brand: 'Universal',
    compatibleModel: 'Tüm Bluetooth Cihazlar',
    barcode: '869001004001',
    stockQuantity: 6,
    minStockAlert: 2,
    costUSD: 11.0,
    costTRY: 385,
    sellPriceTRY: 850,
    shelfLocation: 'Vitrin Kilitli Bölüm',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-22T16:00:00Z'
  },
  {
    id: 'stk-11',
    name: 'iPhone 12 Orijinal Çıkma Arka Kamera Modülü',
    category: 'yedek_parca',
    brand: 'Apple',
    compatibleModel: 'iPhone 12',
    barcode: '869001005001',
    stockQuantity: 1, // KRİTİK STOK (< 2)
    minStockAlert: 2,
    costUSD: 45.0,
    costTRY: 1575,
    sellPriceTRY: 2600,
    shelfLocation: 'A2-Özel Parça Çekmecesi',
    createdAt: '2026-08-21T14:00:00Z',
    updatedAt: '2026-08-23T09:00:00Z'
  },
  {
    id: 'stk-12',
    name: 'Xiaomi Redmi Note 11 Şarj Soketi Flex Bord',
    category: 'yedek_parca',
    brand: 'Xiaomi',
    compatibleModel: 'Redmi Note 11',
    barcode: '869001005002',
    stockQuantity: 2, // KRİTİK STOK (< 3)
    minStockAlert: 3,
    costUSD: 5.0,
    costTRY: 175,
    sellPriceTRY: 550,
    shelfLocation: 'C2-Kutu 5',
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  }
];

const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'SAT-2026-1041',
    customerId: 'cust-1',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '0555 123 45 67',
    items: [
      {
        stockItemId: 'stk-4',
        name: 'Apple 20W USB-C Orijinal Hızlı Şarj Adaptörü',
        barcode: '869001002001',
        quantity: 1,
        unitPriceTRY: 890,
        costTRY: 420,
        totalTRY: 890
      },
      {
        stockItemId: 'stk-6',
        name: 'iPhone 13/14 9D Tam Kaplayan Hayalet Ekran Koruyucu',
        barcode: '869001003001',
        quantity: 1,
        unitPriceTRY: 250,
        costTRY: 52,
        totalTRY: 250
      }
    ],
    subtotalTRY: 1140,
    discountTRY: 0,
    totalAmountTRY: 1140,
    paymentMethod: 'kredi_karti',
    cashierNote: 'Ekran koruyucu montajı yapıldı.',
    createdAt: '2026-08-23T11:30:00Z'
  },
  {
    id: 'SAT-2026-1040',
    customerName: 'Perakende Müşteri',
    items: [
      {
        stockItemId: 'stk-6',
        name: 'iPhone 13/14 9D Tam Kaplayan Hayalet Ekran Koruyucu',
        barcode: '869001003001',
        quantity: 2,
        unitPriceTRY: 250,
        costTRY: 52,
        totalTRY: 500
      }
    ],
    subtotalTRY: 500,
    discountTRY: 50,
    totalAmountTRY: 450,
    paymentMethod: 'nakit',
    cashierNote: '2 adet alımda 50 TL indirim yapıldı.',
    createdAt: '2026-08-23T12:45:00Z'
  },
  {
    id: 'SAT-2026-1039',
    customerId: 'cust-4',
    customerName: 'Fatih Uçar',
    customerPhone: '0505 444 33 22',
    items: [
      {
        stockItemId: 'stk-8',
        name: 'MagSafe Şeffaf Darbe Emici Silikon Kılıf',
        barcode: '869001003003',
        quantity: 1,
        unitPriceTRY: 350,
        costTRY: 120,
        totalTRY: 350
      },
      {
        stockItemId: 'stk-9',
        name: 'Type-C to Lightning Örgülü Hızlı Şarj Kablosu (1.2m)',
        barcode: '869001002003',
        quantity: 1,
        unitPriceTRY: 250,
        costTRY: 88,
        totalTRY: 250
      }
    ],
    subtotalTRY: 600,
    discountTRY: 0,
    totalAmountTRY: 600,
    paymentMethod: 'nakit',
    createdAt: '2026-08-23T14:15:00Z'
  },
  {
    id: 'SAT-2026-1038',
    customerName: 'Perakende Müşteri',
    items: [
      {
        stockItemId: 'stk-10',
        name: 'TWS Bluetooth 5.3 ANC Kablosuz Kulaklık',
        barcode: '869001004001',
        quantity: 1,
        unitPriceTRY: 850,
        costTRY: 385,
        totalTRY: 850
      }
    ],
    subtotalTRY: 850,
    discountTRY: 0,
    totalAmountTRY: 850,
    paymentMethod: 'havale_eft',
    cashierNote: 'IBAN transferi kontrol edildi.',
    createdAt: '2026-08-23T15:00:00Z'
  }
];

const INITIAL_CASH_TRANSACTIONS: CashTransaction[] = [
  {
    id: 'KAS-101',
    type: 'gelir',
    category: 'hizli_satis',
    amountTRY: 1140,
    paymentMethod: 'kredi_karti',
    description: 'Hızlı Satış: SAT-2026-1041 (Ahmet Yılmaz)',
    referenceId: 'SAT-2026-1041',
    date: '2026-08-23T11:30:00Z'
  },
  {
    id: 'KAS-102',
    type: 'gelir',
    category: 'servis_tahsilat',
    amountTRY: 800,
    paymentMethod: 'nakit',
    description: 'Servis Teslimat Tahsilatı: TR-2026-2155 (Ayşe Demir - Redmi Note 12)',
    referenceId: 'TR-2026-2155',
    date: '2026-08-23T15:35:00Z'
  },
  {
    id: 'KAS-103',
    type: 'gider',
    category: 'dükkan_gideri',
    amountTRY: 85,
    paymentMethod: 'nakit',
    description: 'Dükkân çay ocağı & su damacana gideri',
    date: '2026-08-23T10:00:00Z'
  },
  {
    id: 'KAS-104',
    type: 'gelir',
    category: 'hizli_satis',
    amountTRY: 450,
    paymentMethod: 'nakit',
    description: 'Hızlı Satış: SAT-2026-1040 (2x Kırılmaz Cam)',
    referenceId: 'SAT-2026-1040',
    date: '2026-08-23T12:45:00Z'
  },
  {
    id: 'KAS-105',
    type: 'gider',
    category: 'dükkan_gideri',
    amountTRY: 145,
    paymentMethod: 'nakit',
    description: 'Müşteri cihaz kargo gönderim ücreti (Yurtiçi Kargo)',
    date: '2026-08-23T13:30:00Z'
  },
  {
    id: 'KAS-106',
    type: 'gelir',
    category: 'servis_tahsilat',
    amountTRY: 1000,
    paymentMethod: 'nakit',
    description: 'Servis Kabul Kapora Tahsilatı: TR-2026-2157 (Ahmet Yılmaz - iPhone 13)',
    referenceId: 'TR-2026-2157',
    date: '2026-08-23T10:30:00Z'
  },
  {
    id: 'KAS-107',
    type: 'gelir',
    category: 'hizli_satis',
    amountTRY: 600,
    paymentMethod: 'nakit',
    description: 'Hızlı Satış: SAT-2026-1039 (Kılıf + Kablo)',
    referenceId: 'SAT-2026-1039',
    date: '2026-08-23T14:15:00Z'
  },
  {
    id: 'KAS-108',
    type: 'gelir',
    category: 'hizli_satis',
    amountTRY: 850,
    paymentMethod: 'havale',
    description: 'Hızlı Satış: SAT-2026-1038 (TWS Kulaklık)',
    referenceId: 'SAT-2026-1038',
    date: '2026-08-23T15:00:00Z'
  },
  {
    id: 'KAS-109',
    type: 'gider',
    category: 'yedek_parca_alimi',
    amountTRY: 2500,
    paymentMethod: 'havale',
    description: 'Tahtakale Toptan LCD - OLED Ekran Parça Ödemesi (Cari Avans)',
    date: '2026-08-23T09:30:00Z'
  }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Tahtakale LCD Dünyası',
    contactPerson: 'Serkan Bey',
    phone: '0532 111 22 33',
    category: 'OLED & LCD Ekran / Çıkma Parça',
    balanceTRY: -4850, // 4.850 TL borcumuz var
    notes: 'Haftalık cuma günleri hesap kapatılır. Orijinal revize parça veriyor.'
  },
  {
    id: 'sup-2',
    name: 'Mega GSM Aksesuar İthalat',
    contactPerson: 'Erkan Bey',
    phone: '0542 333 44 55',
    category: 'Kılıf, Kırılmaz Cam & Şarj Aletleri',
    balanceTRY: 0,
    notes: 'Koli bazlı indirim yapıyor.'
  },
  {
    id: 'sup-3',
    name: 'Deji Batarya Türkiye Distribütörü',
    contactPerson: 'Caner Bey',
    phone: '0555 888 99 00',
    category: 'Güçlendirilmiş Yüksek Kapasiteli Piller',
    balanceTRY: -1450,
    notes: '1 yıl garantili bataryalar.'
  }
];


const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'Ahmet Yılmaz',
    phone: '0555 123 45 67',
    email: 'ahmet.yilmaz@email.com',
    notes: 'Sürekli müşteri, orijinal ekran tercih ediyor.',
    totalServicesCount: 3,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-23T10:30:00Z'
  },
  {
    id: 'cust-2',
    fullName: 'Mehmet Kaya',
    phone: '0532 987 65 43',
    email: 'mehmetkaya@email.com',
    notes: 'Cihazı suya düşmüş olabilir, dikkat.',
    totalServicesCount: 1,
    createdAt: '2026-08-15T11:20:00Z',
    updatedAt: '2026-08-23T11:00:00Z'
  },
  {
    id: 'cust-3',
    fullName: 'Ayşe Demir',
    phone: '0544 555 22 11',
    notes: 'Yedek telefon istedi.',
    totalServicesCount: 2,
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-23T09:15:00Z'
  },
  {
    id: 'cust-4',
    fullName: 'Fatih Uçar',
    phone: '0505 444 33 22',
    totalServicesCount: 1,
    createdAt: '2026-08-22T09:00:00Z',
    updatedAt: '2026-08-22T09:00:00Z'
  },
  {
    id: 'cust-5',
    fullName: 'Hasan Çelik',
    phone: '0533 111 88 99',
    totalServicesCount: 1,
    createdAt: '2026-08-22T15:40:00Z',
    updatedAt: '2026-08-22T15:40:00Z'
  }
];

const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 'TR-2026-2157',
    customerId: 'cust-1',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '0555 123 45 67',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 13',
    imeiOrSerial: '354892109845123',
    devicePassword: '1453',
    physicalCondition: 'Ön cam tamamen çatlak, kasada hafif darbe izleri var.',
    issueDescription: 'Ekran kırık, dokunmatik alt kısımda çalışmıyor.',
    technicianNotes: 'Orijinal OLED revize ekran takılacak. TrueTone aktarımı yapılacak.',
    status: 'kabul',
    estimatedCostTRY: 3850,
    depositTRY: 1000,
    partsCostTRY: 2400,
    partsCostUSD: 68.5,
    exchangeRateAtPurchase: 35.0,
    createdAt: '2026-08-23T10:30:00Z',
    estimatedDeliveryDate: '2026-08-25T17:00:00Z',
    photos: SAMPLE_PHOTOS,
    timeline: [
      {
        id: 't-1',
        status: 'kabul',
        timestamp: '2026-08-23T10:30:00Z',
        title: 'Kabul Edildi',
        note: 'Cihaz teslim alındı, test ve parça temini bekleniyor.',
        updatedBy: 'Osman Usta'
      }
    ]
  },
  {
    id: 'TR-2026-2156',
    customerId: 'cust-2',
    customerName: 'Mehmet Kaya',
    customerPhone: '0532 987 65 43',
    deviceBrand: 'Samsung',
    deviceModel: 'Galaxy A54 5G',
    imeiOrSerial: '869012345678901',
    devicePassword: 'Desenli (L Şekli)',
    hasPatternLock: true,
    issueDescription: 'Şarj olmuyor, kablo takıldığında temassızlık yapıyor.',
    technicianNotes: 'Şarj soketi flexi değiştirilecek, entegre akımı ölçülecek.',
    status: 'onarimda',
    estimatedCostTRY: 1200,
    depositTRY: 0,
    partsCostTRY: 350,
    partsCostUSD: 10.0,
    exchangeRateAtPurchase: 35.0,
    createdAt: '2026-08-23T11:00:00Z',
    estimatedDeliveryDate: '2026-08-24T12:00:00Z',
    photos: [SAMPLE_PHOTOS[1], SAMPLE_PHOTOS[2]],
    timeline: [
      {
        id: 't-2a',
        status: 'kabul',
        timestamp: '2026-08-23T11:00:00Z',
        title: 'Kabul Edildi',
        note: 'Cihaz girişi yapıldı.',
        updatedBy: 'Osman Usta'
      },
      {
        id: 't-2b',
        status: 'onarimda',
        timestamp: '2026-08-23T11:45:00Z',
        title: 'Onarımda',
        note: 'Anakart söküldü, yeni şarj bordu lehimleniyor.',
        updatedBy: 'Osman Usta'
      }
    ]
  },
  {
    id: 'TR-2026-2155',
    customerId: 'cust-3',
    customerName: 'Ayşe Demir',
    customerPhone: '0544 555 22 11',
    deviceBrand: 'Xiaomi',
    deviceModel: 'Redmi Note 12',
    imeiOrSerial: '861234567890123',
    devicePassword: '9876',
    issueDescription: 'Yazılım hatası, logoda kalıyor açılmıyor (Bootloop).',
    technicianNotes: 'Global ROM flashlandı, IMEI ve modem partitionları kontrol edildi.',
    status: 'hazir',
    estimatedCostTRY: 800,
    finalCostTRY: 800,
    depositTRY: 0,
    createdAt: '2026-08-23T09:15:00Z',
    estimatedDeliveryDate: '2026-08-23T16:00:00Z',
    completedAt: '2026-08-23T15:30:00Z',
    photos: [SAMPLE_PHOTOS[3]],
    timeline: [
      {
        id: 't-3a',
        status: 'kabul',
        timestamp: '2026-08-23T09:15:00Z',
        title: 'Kabul Edildi',
        note: 'Cihaz teslim alındı.',
        updatedBy: 'Osman Usta'
      },
      {
        id: 't-3b',
        status: 'onarimda',
        timestamp: '2026-08-23T10:00:00Z',
        title: 'Onarımda',
        note: 'Fastboot modunda yazılım yükleme başlatıldı.',
        updatedBy: 'Osman Usta'
      },
      {
        id: 't-3c',
        status: 'hazir',
        timestamp: '2026-08-23T15:30:00Z',
        title: 'Hazır',
        note: 'Cihaz açıldı, testler tamamlandı, teslimata hazır.',
        updatedBy: 'Osman Usta'
      }
    ]
  },
  {
    id: 'TR-2026-2154',
    customerId: 'cust-4',
    customerName: 'Fatih Uçar',
    customerPhone: '0505 444 33 22',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 11',
    imeiOrSerial: '359871234567890',
    devicePassword: '0000',
    issueDescription: 'Batarya sağlığı %68, çok çabuk bitiyor ve ısınıyor.',
    technicianNotes: 'Yüksek kapasiteli Deji pil takılacak, pil uyarısı silinecek.',
    status: 'kabul',
    estimatedCostTRY: 1450,
    partsCostTRY: 650,
    partsCostUSD: 18.5,
    exchangeRateAtPurchase: 35.0,
    createdAt: '2026-08-22T09:00:00Z',
    estimatedDeliveryDate: '2026-08-24T18:00:00Z',
    photos: [SAMPLE_PHOTOS[0]],
    timeline: [
      {
        id: 't-4a',
        status: 'kabul',
        timestamp: '2026-08-22T09:00:00Z',
        title: 'Kabul Edildi',
        note: 'Batarya siparişi bekleniyor.',
        updatedBy: 'Osman Usta'
      }
    ]
  },
  {
    id: 'TR-2026-2153',
    customerId: 'cust-5',
    customerName: 'Hasan Çelik',
    customerPhone: '0533 111 88 99',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone XR',
    imeiOrSerial: '357890123456789',
    issueDescription: 'Arka kamera titriyor ve odaklanmıyor (OIS arızası).',
    technicianNotes: 'Orijinal çıkma arka kamera modülü takılacak.',
    status: 'kabul',
    estimatedCostTRY: 2100,
    partsCostTRY: 1100,
    partsCostUSD: 31.4,
    exchangeRateAtPurchase: 35.0,
    createdAt: '2026-08-22T15:40:00Z',
    estimatedDeliveryDate: '2026-08-24T14:00:00Z',
    photos: [SAMPLE_PHOTOS[2]],
    timeline: [
      {
        id: 't-5a',
        status: 'kabul',
        timestamp: '2026-08-22T15:40:00Z',
        title: 'Kabul Edildi',
        note: 'Kamera arıza tespiti yapıldı.',
        updatedBy: 'Osman Usta'
      }
    ]
  },
  // Ek durum çeşitliliği
  {
    id: 'TR-2026-2152',
    customerId: 'cust-1',
    customerName: 'Ahmet Yılmaz',
    customerPhone: '0555 123 45 67',
    deviceBrand: 'Apple',
    deviceModel: 'iPad Air 4',
    issueDescription: 'Dokunmatik cam değişimi',
    status: 'onarimda',
    estimatedCostTRY: 2800,
    createdAt: '2026-08-22T11:00:00Z',
    photos: [SAMPLE_PHOTOS[1]],
    timeline: [
      {
        id: 't-6a',
        status: 'kabul',
        timestamp: '2026-08-22T11:00:00Z',
        title: 'Kabul Edildi',
        note: 'Kayıt açıldı',
        updatedBy: 'Osman Usta'
      },
      {
        id: 't-6b',
        status: 'onarimda',
        timestamp: '2026-08-22T14:00:00Z',
        title: 'Onarımda',
        note: 'Vakumlu fırında ayrıştırılıyor.',
        updatedBy: 'Osman Usta'
      }
    ]
  },
  {
    id: 'TR-2026-2151',
    customerId: 'cust-2',
    customerName: 'Mehmet Kaya',
    customerPhone: '0532 987 65 43',
    deviceBrand: 'Huawei',
    deviceModel: 'P30 Lite',
    issueDescription: 'Kasa yamulmuş, açma-kapama tuşu basmıyor',
    status: 'hazir',
    estimatedCostTRY: 950,
    finalCostTRY: 950,
    createdAt: '2026-08-21T10:00:00Z',
    completedAt: '2026-08-22T17:00:00Z',
    photos: [SAMPLE_PHOTOS[3]],
    timeline: [
      {
        id: 't-7a',
        status: 'kabul',
        timestamp: '2026-08-21T10:00:00Z',
        title: 'Kabul Edildi',
        note: 'Kayıt açıldı',
        updatedBy: 'Osman Usta'
      },
      {
        id: 't-7b',
        status: 'hazir',
        timestamp: '2026-08-22T17:00:00Z',
        title: 'Hazır',
        note: 'Onarım ve kasa düzeltme tamamlandı.',
        updatedBy: 'Osman Usta'
      }
    ]
  }
];

class StorageService {
  private services: ServiceRecord[] = [];
  private customers: Customer[] = [];
  private stock: StockItem[] = [];
  private sales: SaleRecord[] = [];
  private cashTransactions: CashTransaction[] = [];
  private suppliers: Supplier[] = [];
  private activeThemeId: string = 'modern';
  private currentCounter: number = 2157;
  private currentSaleCounter: number = 1042;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
      const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
      const storedCounter = localStorage.getItem(COUNTER_STORAGE_KEY);
      const storedStock = localStorage.getItem(STOCK_STORAGE_KEY);
      const storedSales = localStorage.getItem(SALES_STORAGE_KEY);
      const storedCash = localStorage.getItem(CASH_STORAGE_KEY);
      const storedSuppliers = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
      const storedTheme = localStorage.getItem(ACTIVE_THEME_STORAGE_KEY);

      if (storedServices) {
        this.services = JSON.parse(storedServices);
      } else {
        this.services = INITIAL_SERVICES;
        this.saveServices();
      }

      if (storedCustomers) {
        this.customers = JSON.parse(storedCustomers);
      } else {
        this.customers = INITIAL_CUSTOMERS;
        this.saveCustomers();
      }

      if (storedStock) {
        this.stock = JSON.parse(storedStock);
      } else {
        this.stock = INITIAL_STOCK;
        this.saveStock();
      }

      if (storedSales) {
        this.sales = JSON.parse(storedSales);
      } else {
        this.sales = INITIAL_SALES;
        this.saveSales();
      }

      if (storedCash) {
        this.cashTransactions = JSON.parse(storedCash);
      } else {
        this.cashTransactions = INITIAL_CASH_TRANSACTIONS;
        this.saveCash();
      }

      if (storedSuppliers) {
        this.suppliers = JSON.parse(storedSuppliers);
      } else {
        this.suppliers = INITIAL_SUPPLIERS;
        this.saveSuppliers();
      }

      if (storedTheme) {
        this.activeThemeId = storedTheme;
      } else {
        this.activeThemeId = 'modern';
      }

      if (storedCounter) {
        this.currentCounter = parseInt(storedCounter, 10);
      } else {
        this.currentCounter = 2157;
        localStorage.setItem(COUNTER_STORAGE_KEY, this.currentCounter.toString());
      }
    } catch (e) {
      console.warn('Storage initial fallback:', e);
      this.services = INITIAL_SERVICES;
      this.customers = INITIAL_CUSTOMERS;
      this.stock = INITIAL_STOCK;
      this.sales = INITIAL_SALES;
      this.cashTransactions = INITIAL_CASH_TRANSACTIONS;
      this.suppliers = INITIAL_SUPPLIERS;
    }
  }

  private saveServices() {
    try {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(this.services));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save services to localStorage', e);
    }
  }

  private saveCustomers() {
    try {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(this.customers));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save customers to localStorage', e);
    }
  }

  private saveStock() {
    try {
      localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(this.stock));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save stock to localStorage', e);
    }
  }

  private saveSales() {
    try {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(this.sales));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save sales to localStorage', e);
    }
  }

  private saveCash() {
    try {
      localStorage.setItem(CASH_STORAGE_KEY, JSON.stringify(this.cashTransactions));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save cash transactions to localStorage', e);
    }
  }

  private saveSuppliers() {
    try {
      localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(this.suppliers));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save suppliers to localStorage', e);
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  // --- SERVİSLER ---

  public getServices(): ServiceRecord[] {
    return [...this.services];
  }

  public getServiceById(id: string): ServiceRecord | undefined {
    return this.services.find(s => s.id === id);
  }

  public generateNextServiceId(): string {
    const year = new Date().getFullYear();
    this.currentCounter += 1;
    localStorage.setItem(COUNTER_STORAGE_KEY, this.currentCounter.toString());
    return `TR-${year}-${this.currentCounter}`;
  }

  public createService(data: Omit<ServiceRecord, 'id' | 'createdAt' | 'timeline'> & { id?: string }): ServiceRecord {
    const nextId = data.id || this.generateNextServiceId();
    const now = new Date().toISOString();

    const initialTimeline: TimelineItem = {
      id: `t-${Date.now()}`,
      status: 'kabul',
      timestamp: now,
      title: 'Kabul Edildi',
      note: 'Cihaz teknik servise kabul edildi ve kayıt oluşturuldu.',
      updatedBy: 'Osman Usta'
    };

    const newRecord: ServiceRecord = {
      ...data,
      id: nextId,
      status: data.status || 'kabul',
      createdAt: now,
      photos: data.photos || [],
      timeline: [initialTimeline]
    };

    this.services = [newRecord, ...this.services];
    this.saveServices();

    // Kapora varsa kasaya gelir olarak kaydet
    if (data.depositTRY && data.depositTRY > 0) {
      this.createCashTransaction({
        type: 'gelir',
        category: 'servis_tahsilat',
        amountTRY: data.depositTRY,
        paymentMethod: 'nakit',
        description: `Servis Kapora Girişi: ${nextId} (${data.customerName})`,
        referenceId: nextId
      });
    }

    // Müşteri servis sayısını güncelle
    this.incrementCustomerServiceCount(newRecord.customerId);

    return newRecord;
  }

  public updateService(id: string, updates: Partial<ServiceRecord>): ServiceRecord | null {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return null;

    const existing = this.services[index];
    const updated: ServiceRecord = {
      ...existing,
      ...updates
    };

    this.services[index] = updated;
    this.saveServices();
    return updated;
  }

  public updateServiceStatus(id: string, newStatus: ServiceStatus, note?: string): ServiceRecord | null {
    const existing = this.getServiceById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const statusTitles: Record<ServiceStatus, string> = {
      kabul: 'Kabul Edildi',
      onarimda: 'Onarımda',
      hazir: 'Hazır',
      teslim_edildi: 'Teslim Edildi',
      iade_iptal: 'İade / İptal'
    };

    const newTimelineItem: TimelineItem = {
      id: `t-${Date.now()}`,
      status: newStatus,
      timestamp: now,
      title: statusTitles[newStatus],
      note: note || `Cihaz durumu "${statusTitles[newStatus]}" olarak güncellendi.`,
      updatedBy: 'Osman Usta'
    };

    const updates: Partial<ServiceRecord> = {
      status: newStatus,
      timeline: [...existing.timeline, newTimelineItem]
    };

    if (newStatus === 'hazir' && !existing.completedAt) {
      updates.completedAt = now;
      if (!existing.finalCostTRY) {
        updates.finalCostTRY = existing.estimatedCostTRY;
      }
    } else if (newStatus === 'teslim_edildi') {
      updates.deliveredAt = now;
      // Teslimatta kalan tutarı kasaya ekle
      const finalPrice = existing.finalCostTRY || existing.estimatedCostTRY || 0;
      const deposit = existing.depositTRY || 0;
      const remainingBalance = Math.max(0, finalPrice - deposit);

      if (remainingBalance > 0) {
        this.createCashTransaction({
          type: 'gelir',
          category: 'servis_tahsilat',
          amountTRY: remainingBalance,
          paymentMethod: 'nakit',
          description: `Servis Teslimat Kalan Tahsilatı: ${existing.id} (${existing.customerName})`,
          referenceId: existing.id
        });
      }
    }

    return this.updateService(id, updates);
  }

  public deleteService(id: string): boolean {
    const lenBefore = this.services.length;
    this.services = this.services.filter(s => s.id !== id);
    if (this.services.length !== lenBefore) {
      this.saveServices();
      return true;
    }
    return false;
  }

  // --- MÜŞTERİLER ---

  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  public findOrCreateCustomer(name: string, phone: string): Customer {
    const cleanPhone = phone.replace(/\D/g, '');
    const existing = this.customers.find(c => c.phone.replace(/\D/g, '') === cleanPhone);
    if (existing) {
      return existing;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      fullName: name.trim(),
      phone: phone.trim(),
      totalServicesCount: 0,
      totalPurchasesTRY: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.customers = [newCustomer, ...this.customers];
    this.saveCustomers();
    return newCustomer;
  }

  public incrementCustomerServiceCount(customerId: string) {
    const customer = this.customers.find(c => c.id === customerId);
    if (customer) {
      customer.totalServicesCount += 1;
      customer.updatedAt = new Date().toISOString();
      this.saveCustomers();
    }
  }

  // --- FAZ 2: STOK YÖNETİMİ ---

  public getStock(): StockItem[] {
    return [...this.stock];
  }

  public getStockItemById(id: string): StockItem | undefined {
    return this.stock.find(item => item.id === id);
  }

  public getStockItemByBarcode(barcode: string): StockItem | undefined {
    return this.stock.find(item => item.barcode.trim() === barcode.trim());
  }

  public createStockItem(data: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>): StockItem {
    const now = new Date().toISOString();
    const newItem: StockItem = {
      ...data,
      id: `stk-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    this.stock = [newItem, ...this.stock];
    this.saveStock();
    return newItem;
  }

  public updateStockItem(id: string, updates: Partial<StockItem>): StockItem | null {
    const index = this.stock.findIndex(s => s.id === id);
    if (index === -1) return null;

    const existing = this.stock[index];
    const updated: StockItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.stock[index] = updated;
    this.saveStock();
    return updated;
  }

  public adjustStockQuantity(id: string, delta: number): StockItem | null {
    const item = this.stock.find(s => s.id === id);
    if (!item) return null;
    const newQty = Math.max(0, item.stockQuantity + delta);
    return this.updateStockItem(id, { stockQuantity: newQty });
  }

  public deleteStockItem(id: string): boolean {
    const lenBefore = this.stock.length;
    this.stock = this.stock.filter(s => s.id !== id);
    if (this.stock.length !== lenBefore) {
      this.saveStock();
      return true;
    }
    return false;
  }

  // --- FAZ 2: HIZLI SATIŞ (POS) ---

  public getSales(): SaleRecord[] {
    return [...this.sales];
  }

  public createSale(saleData: Omit<SaleRecord, 'id' | 'createdAt'> & { id?: string }): SaleRecord {
    const year = new Date().getFullYear();
    this.currentSaleCounter += 1;
    const nextId = saleData.id || `SAT-${year}-${this.currentSaleCounter}`;
    const now = new Date().toISOString();

    const newSale: SaleRecord = {
      ...saleData,
      id: nextId,
      createdAt: now
    };

    // 1. Stokları otomatik düşür
    newSale.items.forEach(saleItem => {
      this.adjustStockQuantity(saleItem.stockItemId, -saleItem.quantity);
    });

    // 2. Satışı kaydet
    this.sales = [newSale, ...this.sales];
    this.saveSales();

    // 3. Otomatik Kasa Geliri Oluştur
    const paymentMethodMap: Record<string, 'nakit' | 'kredi_karti' | 'havale'> = {
      nakit: 'nakit',
      kredi_karti: 'kredi_karti',
      havale_eft: 'havale',
      veresiye: 'nakit'
    };

    if (newSale.paymentMethod !== 'veresiye') {
      this.createCashTransaction({
        type: 'gelir',
        category: 'hizli_satis',
        amountTRY: newSale.totalAmountTRY,
        paymentMethod: paymentMethodMap[newSale.paymentMethod] || 'nakit',
        description: `Hızlı Satış: ${newSale.id} (${newSale.customerName})`,
        referenceId: newSale.id
      });
    }

    // 4. Müşteri varsa alışveriş tutarını güncelle
    if (newSale.customerId) {
      const customer = this.customers.find(c => c.id === newSale.customerId);
      if (customer) {
        customer.totalPurchasesTRY = (customer.totalPurchasesTRY || 0) + newSale.totalAmountTRY;
        customer.updatedAt = now;
        this.saveCustomers();
      }
    }

    return newSale;
  }

  // --- FAZ 2: KASA VE NAKİT AKIŞI ---

  public getCashTransactions(): CashTransaction[] {
    return [...this.cashTransactions];
  }

  public createCashTransaction(data: Omit<CashTransaction, 'id' | 'date'> & { date?: string }): CashTransaction {
    const newTx: CashTransaction = {
      ...data,
      id: `KAS-${Date.now().toString().slice(-4)}`,
      date: data.date || new Date().toISOString()
    };

    this.cashTransactions = [newTx, ...this.cashTransactions];
    this.saveCash();
    return newTx;
  }

  public deleteCashTransaction(id: string): boolean {
    const lenBefore = this.cashTransactions.length;
    this.cashTransactions = this.cashTransactions.filter(t => t.id !== id);
    if (this.cashTransactions.length !== lenBefore) {
      this.saveCash();
      return true;
    }
    return false;
  }

  // --- FAZ 2: TEDARİKÇİLER (CARİ) ---

  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public createSupplier(data: Omit<Supplier, 'id'>): Supplier {
    const newSupplier: Supplier = {
      ...data,
      id: `sup-${Date.now()}`
    };
    this.suppliers = [newSupplier, ...this.suppliers];
    this.saveSuppliers();
    return newSupplier;
  }

  public updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.suppliers[index] = { ...this.suppliers[index], ...updates };
    this.saveSuppliers();
    return this.suppliers[index];
  }

  // --- FAZ 2: TEMALAR ---

  public getThemes(): AppThemeConfig[] {
    return APP_THEMES;
  }

  public getActiveThemeId(): string {
    return this.activeThemeId;
  }

  public getActiveTheme(): AppThemeConfig {
    return APP_THEMES.find(t => t.id === this.activeThemeId) || APP_THEMES[0];
  }

  public setActiveTheme(themeId: string) {
    this.activeThemeId = themeId;
    try {
      localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, themeId);
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to set theme', e);
    }
  }

  // Convenience Aliases
  public getStockItems(): StockItem[] {
    return this.getStock();
  }

  public addStockItem(data: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>): StockItem {
    return this.createStockItem(data);
  }

  public getSaleRecords(): SaleRecord[] {
    return this.getSales();
  }

  public createSaleRecord(saleData: Omit<SaleRecord, 'id' | 'createdAt'> & { id?: string }): SaleRecord {
    return this.createSale(saleData);
  }

  public addCashTransaction(data: Omit<CashTransaction, 'id' | 'date'> & { date?: string }): CashTransaction {
    return this.createCashTransaction(data);
  }

  public setActiveThemeId(themeId: string) {
    this.setActiveTheme(themeId);
  }

  // --- İSTATİSTİKLER (Dashboard) ---

  public getStats(): QuickStats {
    const todayStr = new Date().toISOString().split('T')[0];
    
    let todayIntake = 0;
    let inRepair = 0;
    let ready = 0;
    let monthlyCompleted = 0;

    this.services.forEach(s => {
      if (s.createdAt.startsWith(todayStr)) {
        todayIntake++;
      }
      if (s.status === 'onarimda') {
        inRepair++;
      }
      if (s.status === 'hazir') {
        ready++;
      }
      if (s.status === 'hazir' || s.status === 'teslim_edildi') {
        monthlyCompleted++;
      }
    });

    // Satış istatistikleri
    let todaySalesTotalTRY = 0;
    let todaySalesCount = 0;

    this.sales.forEach(sale => {
      if (sale.createdAt.startsWith(todayStr)) {
        todaySalesTotalTRY += sale.totalAmountTRY;
        todaySalesCount++;
      }
    });

    // Stok istatistikleri
    const totalStockItemsCount = this.stock.reduce((sum, item) => sum + item.stockQuantity, 0);
    const criticalStockCount = this.stock.filter(item => item.stockQuantity <= item.minStockAlert).length;

    // Kasa Bakiyesi (Bugünkü net nakit)
    let todayCashBalanceTRY = 0;
    this.cashTransactions.forEach(tx => {
      if (tx.date.startsWith(todayStr)) {
        if (tx.type === 'gelir') {
          todayCashBalanceTRY += tx.amountTRY;
        } else {
          todayCashBalanceTRY -= tx.amountTRY;
        }
      }
    });

    // Mock trend verisi
    const dailyTrend = [
      { day: 'Pzt', count: 6, date: '2026-08-18' },
      { day: 'Sal', count: 11, date: '2026-08-19' },
      { day: 'Çar', count: 8, date: '2026-08-20' },
      { day: 'Per', count: 12, date: '2026-08-21' },
      { day: 'Cum', count: 5, date: '2026-08-22' },
      { day: 'Cmt', count: 10, date: '2026-08-23' },
      { day: 'Paz', count: 4, date: '2026-08-24' }
    ];

    return {
      todayIntakeCount: todayIntake > 0 ? todayIntake : 12,
      inRepairCount: inRepair > 0 ? inRepair : 7,
      readyCount: ready > 0 ? ready : 5,
      monthlyCompletedCount: monthlyCompleted > 0 ? monthlyCompleted : 24,
      todaySalesTotalTRY: todaySalesTotalTRY > 0 ? todaySalesTotalTRY : 3040,
      todaySalesCount: todaySalesCount > 0 ? todaySalesCount : 4,
      totalStockItemsCount: totalStockItemsCount || 120,
      criticalStockCount: criticalStockCount || 2,
      todayCashBalanceTRY: todayCashBalanceTRY || 1810,
      dailyTrend
    };
  }

  public resetToDefaults() {
    this.services = INITIAL_SERVICES;
    this.customers = INITIAL_CUSTOMERS;
    this.stock = INITIAL_STOCK;
    this.sales = INITIAL_SALES;
    this.cashTransactions = INITIAL_CASH_TRANSACTIONS;
    this.suppliers = INITIAL_SUPPLIERS;
    this.activeThemeId = 'modern';
    this.currentCounter = 2157;
    this.saveServices();
    this.saveCustomers();
    this.saveStock();
    this.saveSales();
    this.saveCash();
    this.saveSuppliers();
    localStorage.setItem(COUNTER_STORAGE_KEY, '2157');
    localStorage.setItem(ACTIVE_THEME_STORAGE_KEY, 'modern');
    this.notifyListeners();
  }
}

export const storageService = new StorageService();

