import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ShoppingCart, 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  ArrowRightLeft, 
  Receipt, 
  User, 
  Tag, 
  Printer, 
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Wrench,
  Package,
  Layers,
  Edit3,
  Check,
  Zap,
  Share2,
  UserPlus,
  Coins
} from 'lucide-react';
import { StockItem, Customer, SaleRecord, SaleItem, StockCategory } from '../types';

interface CartItem {
  id: string;
  stockItemId?: string;
  name: string;
  category?: string;
  itemType: 'product' | 'service';
  unitPriceTRY: number;
  costTRY: number;
  quantity: number;
  barcode?: string;
  isManual?: boolean;
  shelfLocation?: string;
}

interface QuickSaleModalProps {
  stockList: StockItem[];
  customers: Customer[];
  onClose: () => void;
  onCompleteSale: (saleData: Omit<SaleRecord, 'id' | 'createdAt'>) => SaleRecord;
  onSaveStockItem?: (stockData: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => StockItem | void;
  onAddCustomer?: (customer: { fullName: string; phone: string }) => Customer;
}

type MainTab = 'catalog' | 'manual' | 'presets';

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({
  stockList,
  customers,
  onClose,
  onCompleteSale,
  onSaveStockItem,
  onAddCustomer
}) => {
  // Aktif Sekme (Katalog / Manuel Giriş / Hızlı Tuşlar)
  const [activeTab, setActiveTab] = useState<MainTab>('manual');

  // Katalog & Barkod Filtreleri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Manuel Kalem Giriş State'leri
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState<string>('');
  const [manualCost, setManualCost] = useState<string>('');
  const [manualQuantity, setManualQuantity] = useState<number>(1);
  const [manualType, setManualType] = useState<'service' | 'product'>('service');
  const [manualCategory, setManualCategory] = useState<StockCategory>('yedek_parca');
  const [saveToStock, setSaveToStock] = useState<boolean>(false);
  const [manualNotification, setManualNotification] = useState<string | null>(null);

  // Sepet State'i
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');

  // Müşteri & Ödeme
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('retail');
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState<boolean>(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // İskonto & Ödeme
  const [discountTRY, setDiscountTRY] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'nakit' | 'kredi_karti' | 'havale_eft' | 'veresiye'>('nakit');
  const [cashierNote, setCashierNote] = useState('');
  
  // Nakit Para Üstü Hesaplayıcı
  const [tenderedCash, setTenderedCash] = useState<string>('');

  // Mobil Görünüm için Sepet Drawer/Modal geçişi
  const [showMobileCart, setShowMobileCart] = useState<boolean>(false);

  // Satış Tamamlandı Ekranı
  const [completedSale, setCompletedSale] = useState<SaleRecord | null>(null);

  // Focus barcode input when switching to catalog
  useEffect(() => {
    if (activeTab === 'catalog') {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 150);
    }
  }, [activeTab]);

  // Hızlı öneri listesi
  const manualSuggestions = [
    { name: 'Kırılmaz Cam Montajı', price: 150, type: 'service' as const },
    { name: 'Şarj Soketi Temizliği', price: 100, type: 'service' as const },
    { name: 'Format & Yazılım Kurulumu', price: 250, type: 'service' as const },
    { name: 'Ahize & Hoparlör Bakımı', price: 100, type: 'service' as const },
    { name: 'Ekran Montaj İşçiliği', price: 250, type: 'service' as const },
    { name: 'Batarya Değişim İşçiliği', price: 200, type: 'service' as const },
    { name: 'Genel Servis / Arıza Tespiti', price: 150, type: 'service' as const },
    { name: 'Universal Silikon Kılıf', price: 120, type: 'product' as const },
    { name: 'Type-C Hızlı Şarj Kablosu', price: 150, type: 'product' as const },
    { name: 'Kamera Lens Koruma Camı', price: 100, type: 'product' as const }
  ];

  // Sık yapılan işlemler (Hızlı Tuşlar Tabı için)
  const presetItems = [
    { title: 'Kırılmaz Cam (9D/11D)', price: 150, category: 'koruma_kilif', type: 'service' as const, badge: 'En Çok Satan', icon: '🛡️' },
    { title: 'Hayalet Gizlilik Camı', price: 200, category: 'koruma_kilif', type: 'service' as const, badge: 'Popüler', icon: '🕶️' },
    { title: 'Şarj Soket & Ahize Temizliği', price: 100, category: 'diger', type: 'service' as const, badge: 'Hızlı İşçilik', icon: '🧼' },
    { title: 'Type-C Hızlı Kablo (3A)', price: 150, category: 'sarj_aksesuar', type: 'product' as const, badge: 'Aksesuar', icon: '🔌' },
    { title: 'Lightning iPhone Kablo', price: 150, category: 'sarj_aksesuar', type: 'product' as const, badge: 'Aksesuar', icon: '⚡' },
    { title: '20W PD Hızlı Adaptör', price: 250, category: 'sarj_aksesuar', type: 'product' as const, badge: 'Orijinal Kalite', icon: '🔋' },
    { title: 'Yazılım Format & Kurulum', price: 250, category: 'diger', type: 'service' as const, badge: 'Servis', icon: '💻' },
    { title: 'Batarya Değişim İşçiliği', price: 250, category: 'batarya', type: 'service' as const, badge: 'Atölye', icon: '🛠️' },
    { title: 'Kamera Koruma Camı', price: 100, category: 'koruma_kilif', type: 'product' as const, badge: 'Koruma', icon: '📷' },
    { title: 'Şeffaf Darbe Emici Kılıf', price: 120, category: 'koruma_kilif', type: 'product' as const, badge: 'Kılıf', icon: '📱' },
    { title: 'Magsafe Zırhlı Kılıf', price: 250, category: 'koruma_kilif', type: 'product' as const, badge: 'Premium', icon: '🧲' },
    { title: 'Sim Kart İğnesi & Adaptör', price: 50, category: 'diger', type: 'product' as const, badge: 'Küçük', icon: '📌' }
  ];

  // Filtrelenmiş stok listesi
  const filteredStock = stockList.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term || 
      item.name.toLowerCase().includes(term) ||
      item.barcode.toLowerCase().includes(term) ||
      (item.compatibleModel && item.compatibleModel.toLowerCase().includes(term)) ||
      item.brand.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  // Barkod okutulduğunda otomatik ekleme
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchTerm.trim();
    if (!cleanSearch) return;

    const matchedItem = stockList.find(s => s.barcode.trim() === cleanSearch);
    if (matchedItem) {
      addStockToCart(matchedItem);
      setSearchTerm('');
    } else {
      // Barkod bulunamadıysa hemen manuel giriş formunu bu barkodla doldur
      setManualName(`Barkodlu Ürün (${cleanSearch})`);
      setActiveTab('manual');
      setManualNotification(`"${cleanSearch}" barkodlu ürün stokta bulunamadı. Buradan manuel fiyat girerek ekleyebilirsiniz.`);
      setTimeout(() => setManualNotification(null), 6000);
    }
  };

  // Stoktan sepete ekle
  const addStockToCart = (stock: StockItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.stockItemId === stock.id);
      if (existing) {
        return prev.map(p => 
          p.stockItemId === stock.id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        );
      }
      return [
        ...prev,
        {
          id: `cart_${stock.id}_${Date.now()}`,
          stockItemId: stock.id,
          name: stock.name,
          category: stock.category,
          itemType: 'product',
          unitPriceTRY: stock.sellPriceTRY,
          costTRY: stock.costTRY,
          quantity: 1,
          barcode: stock.barcode,
          isManual: false,
          shelfLocation: stock.shelfLocation
        }
      ];
    });
  };

  // Manuel ürün/hizmet ekle
  const handleAddManualItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanName = manualName.trim();
    const priceNum = parseFloat(manualPrice);

    if (!cleanName) {
      setManualNotification('Lütfen ürün veya hizmet adı yazın.');
      setTimeout(() => setManualNotification(null), 3000);
      return;
    }

    if (isNaN(priceNum) || priceNum < 0) {
      setManualNotification('Lütfen geçerli bir satış fiyatı girin.');
      setTimeout(() => setManualNotification(null), 3000);
      return;
    }

    const costNum = parseFloat(manualCost) || 0;
    const qty = Math.max(1, manualQuantity || 1);
    const manualBarcodeCode = 'MNL-' + Math.floor(100000 + Math.random() * 900000);

    let savedStockId: string | undefined = undefined;

    // Stoka da kaydetme isteği varsa
    if (saveToStock && onSaveStockItem) {
      const createdItem = onSaveStockItem({
        name: cleanName,
        category: manualCategory,
        brand: 'Genel',
        barcode: manualBarcodeCode,
        stockQuantity: Math.max(0, 10 - qty),
        minStockAlert: 3,
        costUSD: Math.round((costNum / 35) * 10) / 10,
        costTRY: costNum,
        sellPriceTRY: priceNum,
        shelfLocation: 'Hızlı Satış'
      });
      if (createdItem && createdItem.id) {
        savedStockId = createdItem.id;
      }
    }

    // Sepete ekle
    const newItem: CartItem = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      stockItemId: savedStockId || `manual_${Date.now()}`,
      name: cleanName,
      category: manualCategory,
      itemType: manualType,
      unitPriceTRY: priceNum,
      costTRY: costNum,
      quantity: qty,
      barcode: manualBarcodeCode,
      isManual: true
    };

    setCart(prev => [newItem, ...prev]);

    // Formu temizle
    setManualName('');
    setManualPrice('');
    setManualCost('');
    setManualQuantity(1);
    setSaveToStock(false);

    setManualNotification(`"${cleanName}" (${priceNum} ₺) sepete eklendi.`);
    setTimeout(() => setManualNotification(null), 3000);
  };

  // Hızlı şablon kalemini sepete ekle
  const handleAddPreset = (preset: typeof presetItems[0]) => {
    const newItem: CartItem = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      stockItemId: `manual_preset_${Date.now()}`,
      name: preset.title,
      category: preset.category,
      itemType: preset.type,
      unitPriceTRY: preset.price,
      costTRY: 0,
      quantity: 1,
      barcode: 'HIZLI-' + Math.floor(1000 + Math.random() * 9000),
      isManual: true
    };

    setCart(prev => [newItem, ...prev]);
    setManualNotification(`"${preset.title}" sepete eklendi.`);
    setTimeout(() => setManualNotification(null), 2500);
  };

  // Sepet miktarını güncelle
  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Sepetten sil
  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  // Fiyatı satır içinde düzenle (in-line edit)
  const startEditingPrice = (item: CartItem) => {
    setEditingItemId(item.id);
    setEditingPriceValue(item.unitPriceTRY.toString());
  };

  const saveEditingPrice = (cartItemId: string) => {
    const parsed = parseFloat(editingPriceValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setCart(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, unitPriceTRY: parsed } : item
      ));
    }
    setEditingItemId(null);
  };

  // Hızlı Müşteri Ekleme
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    if (onAddCustomer) {
      const created = onAddCustomer({
        fullName: newCustName.trim(),
        phone: newCustPhone.trim()
      });
      setSelectedCustomerId(created.id);
    }
    setNewCustName('');
    setNewCustPhone('');
    setShowQuickCustomerModal(false);
  };

  // Hesaplamalar
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalTRY = cart.reduce((sum, item) => sum + (item.unitPriceTRY * item.quantity), 0);
  const finalTotalTRY = Math.max(0, subtotalTRY - (discountTRY || 0));

  // Para Üstü Hesaplayıcı
  const tenderedNum = parseFloat(tenderedCash) || 0;
  const changeTRY = paymentMethod === 'nakit' && tenderedNum > 0 ? Math.max(0, tenderedNum - finalTotalTRY) : 0;
  const isTenderedEnough = paymentMethod !== 'nakit' || tenderedNum === 0 || tenderedNum >= finalTotalTRY;

  // Satışı Tamamla
  const handleCheckout = () => {
    if (cart.length === 0) return;

    let customerName = 'Perakende Müşteri';
    let customerPhone: string | undefined = undefined;

    if (selectedCustomerId !== 'retail') {
      const cust = customers.find(c => c.id === selectedCustomerId);
      if (cust) {
        customerName = cust.fullName;
        customerPhone = cust.phone;
      }
    }

    const saleItems: SaleItem[] = cart.map(c => ({
      stockItemId: c.stockItemId || c.id,
      name: c.name,
      barcode: c.barcode || 'MANUEL',
      quantity: c.quantity,
      unitPriceTRY: c.unitPriceTRY,
      costTRY: c.costTRY,
      totalTRY: c.unitPriceTRY * c.quantity,
      isManual: c.isManual,
      itemType: c.itemType
    }));

    const record = onCompleteSale({
      customerId: selectedCustomerId !== 'retail' ? selectedCustomerId : undefined,
      customerName,
      customerPhone,
      items: saleItems,
      subtotalTRY,
      discountTRY: Number(discountTRY) || 0,
      totalAmountTRY: finalTotalTRY,
      paymentMethod,
      cashierNote: cashierNote.trim() || undefined
    });

    setCompletedSale(record);
  };

  // WhatsApp Fişi Oluşturma
  const handleShareWhatsApp = () => {
    if (!completedSale) return;
    const phone = completedSale.customerPhone?.replace(/\D/g, '') || '';
    const itemsText = completedSale.items.map(it => `• ${it.quantity}x ${it.name} - ${it.totalTRY} ₺`).join('%0A');
    const msg = `*OSMANTEKNİK PRO GSM - SATIŞ FİŞİ*%0A` +
      `Fiş No: ${completedSale.id}%0A` +
      `Müşteri: ${completedSale.customerName}%0A` +
      `Tarih: ${new Date(completedSale.createdAt).toLocaleDateString('tr-TR')} ${new Date(completedSale.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}%0A` +
      `------------------------%0A` +
      `${itemsText}%0A` +
      `------------------------%0A` +
      (completedSale.discountTRY > 0 ? `İndirim: -${completedSale.discountTRY} ₺%0A` : '') +
      `*Toplam Tutar: ${completedSale.totalAmountTRY} ₺*%0A` +
      `Ödeme Türü: ${completedSale.paymentMethod.toUpperCase()}%0A%0A` +
      `Bizi tercih ettiğiniz için teşekkür ederiz!`;

    const url = phone ? `https://wa.me/90${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(url, '_blank');
  };

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Tüm Ürünler' },
    { id: 'koruma_kilif', label: 'Cam & Kılıf' },
    { id: 'sarj_aksesuar', label: 'Şarj & Kablo' },
    { id: 'batarya', label: 'Batarya' },
    { id: 'ekran', label: 'Ekran' },
    { id: 'yedek_parca', label: 'Yedek Parça' },
    { id: 'kulaklik_ses', label: 'Ses & Kulaklık' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl h-[96vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ÜST BAŞLIK (HEADER) */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Hızlı Satış & Kasa POS
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  <Zap className="w-3 h-3" />
                  MANUEL & BARKODLU
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stoktan seçin veya anında serbest fiyatlı ürün/işçilik girişi yapın
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobil Sepet Açma Butonu */}
            <button
              onClick={() => setShowMobileCart(true)}
              className="lg:hidden px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Sepet ({totalItemCount})</span>
              <span className="bg-amber-600 px-1.5 py-0.5 rounded-md text-[10px]">
                {finalTotalTRY} ₺
              </span>
            </button>

            <button
              onClick={onClose}
              id="close-quick-sale-btn"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BİLDİRİM TOAST */}
        {manualNotification && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-inner shrink-0 transition-all animate-slideDown">
            <Sparkles className="w-4 h-4" />
            <span>{manualNotification}</span>
          </div>
        )}

        {/* SATIŞ TAMAMLANDI EKRANI (FİŞ & WHATSAPP) */}
        {completedSale ? (
          <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center text-center overflow-y-auto max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Satış Başarıyla Tamamlandı!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kasa hareketlerine işlendi ve varsa stok adetleri otomatik güncellendi.
              </p>
            </div>

            {/* Fiş Görsel Kartı */}
            <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs shadow-sm">
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 pb-2 text-center">
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">OSMANTEKNİK PRO GSM</p>
                <p className="text-[10px] text-slate-400">Hızlı Satış & Servis Fişi</p>
              </div>

              <div className="flex justify-between font-mono font-bold text-slate-500">
                <span>Fiş No:</span>
                <span className="text-indigo-600 dark:text-indigo-400">{completedSale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Müşteri:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{completedSale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ödeme Şekli:</span>
                <span className="font-bold capitalize text-slate-900 dark:text-white">
                  {completedSale.paymentMethod.replace('_', ' ')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                {completedSale.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                      {it.isManual ? (
                        <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                          {it.itemType === 'service' ? 'İşçilik' : 'Manuel'}
                        </span>
                      ) : (
                        <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Stok
                        </span>
                      )}
                      <span className="truncate">{it.quantity}x {it.name}</span>
                    </div>
                    <span className="font-mono font-bold shrink-0">{it.totalTRY} ₺</span>
                  </div>
                ))}
              </div>

              {completedSale.discountTRY > 0 && (
                <div className="flex justify-between text-rose-600 pt-1">
                  <span>İndirim:</span>
                  <span className="font-mono">-{completedSale.discountTRY} ₺</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Toplam Tahsilat:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{completedSale.totalAmountTRY} ₺</span>
              </div>

              {completedSale.cashierNote && (
                <p className="text-[10px] text-slate-400 italic pt-1">
                  Not: {completedSale.cashierNote}
                </p>
              )}
            </div>

            {/* İşlem Butonları */}
            <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>80mm Termal Fiş Yazdır</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Fiş Gönder</span>
              </button>
            </div>

            <button
              onClick={() => {
                setCompletedSale(null);
                setCart([]);
                setDiscountTRY(0);
                setCashierNote('');
                setTenderedCash('');
              }}
              className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-2xl transition"
            >
              + Yeni Satış Başlat
            </button>
          </div>
        ) : (
          /* ANA SATIŞ EKRANI: SOLDA GİRİŞ MODLARI, SAĞDA SEPET & KASA */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            
            {/* SOL TARAF: 3 SEÇENEKLİ GİRİŞ ALANI (MANUEL / STOK / HIZLI TUŞLAR) */}
            <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
              
              {/* ANA SEKMELER */}
              <div className="p-2 sm:p-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  id="tab-manual-entry"
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'manual'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Manuel Giriş & İşçilik</span>
                </button>

                <button
                  type="button"
                  id="tab-catalog-entry"
                  onClick={() => setActiveTab('catalog')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'catalog'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Barcode className="w-4 h-4" />
                  <span>Stok & Barkod</span>
                </button>

                <button
                  type="button"
                  id="tab-presets-entry"
                  onClick={() => setActiveTab('presets')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'presets'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Hızlı Tuşlar</span>
                </button>
              </div>

              {/* 1. SEÇENEK: MANUEL ÜRÜN & İŞÇİLİK GİRİŞİ */}
              {activeTab === 'manual' && (
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                  
                  <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          ✍️
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Serbest Fiyatlı Kalem Ekle
                        </h3>
                      </div>
                      
                      {/* Tür Seçici (İşçilik / Ürün) */}
                      <div className="flex items-center bg-slate-100 dark:bg-slate-700/80 p-0.5 rounded-xl text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setManualType('service')}
                          className={`px-3 py-1 rounded-lg transition ${
                            manualType === 'service'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          🛠️ Hizmet / İşçilik
                        </button>
                        <button
                          type="button"
                          onClick={() => setManualType('product')}
                          className={`px-3 py-1 rounded-lg transition ${
                            manualType === 'product'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          📦 Ürün / Aksesuar
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleAddManualItem} className="space-y-3">
                      {/* Kalem Adı */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {manualType === 'service' ? 'Hizmet / İşçilik Açıklaması' : 'Ürün / Aksesuar Adı'}
                        </label>
                        <input
                          type="text"
                          autoFocus
                          placeholder={manualType === 'service' ? 'Örn: Ahize Temizleme, Format, Cam Montajı...' : 'Örn: 20W Başlık, Universal Kılıf, iPhone 11 Cam...'}
                          value={manualName}
                          onChange={e => setManualName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition"
                        />
                      </div>

                      {/* Hızlı Öneri Etiketleri */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          Sık Kullanılan Öneriler:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {manualSuggestions.map((sug, i) => (
                            <button
                              type="button"
                              key={i}
                              onClick={() => {
                                setManualName(sug.name);
                                setManualPrice(sug.price.toString());
                                setManualType(sug.type);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition active:scale-95"
                            >
                              {sug.name} ({sug.price} ₺)
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Fiyat, Adet ve Maliyet */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {/* Satış Fiyatı */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                            <span>Satış Fiyatı (₺) *</span>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">KDV Dahil</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              min="0"
                              placeholder="0.00"
                              value={manualPrice}
                              onChange={e => setManualPrice(e.target.value)}
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-lg font-black text-amber-600 dark:text-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
                            />
                            <span className="absolute right-3.5 top-2.5 text-sm font-bold text-slate-400">
                              ₺
                            </span>
                          </div>

                          {/* Hızlı Tutar Ekle Butonları */}
                          <div className="flex gap-1 mt-1.5 overflow-x-auto no-scrollbar">
                            {[50, 100, 150, 200, 250, 500].map(amt => (
                              <button
                                type="button"
                                key={amt}
                                onClick={() => {
                                  const cur = parseFloat(manualPrice) || 0;
                                  setManualPrice((cur + amt).toString());
                                }}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold shrink-0"
                              >
                                +{amt} ₺
                              </button>
                            ))}
                            {manualPrice && (
                              <button
                                type="button"
                                onClick={() => setManualPrice('')}
                                className="px-1.5 py-0.5 text-[10px] text-rose-500 hover:underline shrink-0"
                              >
                                Sıfırla
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Adet */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Adet
                          </label>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => setManualQuantity(Math.max(1, manualQuantity - 1))}
                              className="w-9 h-10 rounded-l-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={manualQuantity}
                              onChange={e => setManualQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full text-center h-10 border-y border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setManualQuantity(manualQuantity + 1)}
                              className="w-9 h-10 rounded-r-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Stoka Kaydetme Seçeneği */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveToStock}
                            onChange={e => setSaveToStock(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <span>Bu ürünü kalıcı olarak Stok & Parça listesine de kaydet</span>
                        </label>

                        {saveToStock && (
                          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kategori</label>
                              <select
                                value={manualCategory}
                                onChange={e => setManualCategory(e.target.value as StockCategory)}
                                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                              >
                                <option value="koruma_kilif">Cam & Kılıf</option>
                                <option value="sarj_aksesuar">Şarj & Aksesuar</option>
                                <option value="batarya">Batarya</option>
                                <option value="ekran">Ekran</option>
                                <option value="yedek_parca">Yedek Parça</option>
                                <option value="kulaklik_ses">Ses & Kulaklık</option>
                                <option value="diger">Diğer</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Maliyet (₺)</label>
                              <input
                                type="number"
                                placeholder="0 ₺"
                                value={manualCost}
                                onChange={e => setManualCost(e.target.value)}
                                className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Sepete Ekle Butonu */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          id="btn-add-manual-item"
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-98 transition"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Sepete Ekle (Enter)</span>
                        </button>
                      </div>
                    </form>
                  </div>

                </div>
              )}

              {/* 2. SEÇENEK: KATALOG & BARKOD OKUYUCU */}
              {activeTab === 'catalog' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Barkod Okuma Formu */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900 shrink-0">
                    <form onSubmit={handleBarcodeSubmit} className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        ref={barcodeInputRef}
                        type="text"
                        placeholder="Barkod okutun veya parça adı yazın (Örn: 869... veya Hayalet Cam)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition"
                      />
                    </form>
                  </div>

                  {/* Kategori Filtre Butonları */}
                  <div className="flex items-center gap-1.5 p-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 no-scrollbar shrink-0">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                          selectedCategory === cat.id
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Ürün Kartları Grid */}
                  <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {filteredStock.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-slate-400 text-xs space-y-2">
                        <Package className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 stroke-1" />
                        <p>Aranan kriterlere uygun stok kartı bulunamadı.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setManualName(searchTerm);
                            setActiveTab('manual');
                          }}
                          className="text-amber-600 dark:text-amber-400 font-bold hover:underline text-xs"
                        >
                          + "{searchTerm || 'Yeni Ürün'}" için manuel giriş aç
                        </button>
                      </div>
                    ) : (
                      filteredStock.map(stock => {
                        const isOutOfStock = stock.stockQuantity <= 0;
                        const isLowStock = stock.stockQuantity <= stock.minStockAlert;

                        return (
                          <button
                            key={stock.id}
                            disabled={isOutOfStock}
                            onClick={() => addStockToCart(stock)}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition group relative ${
                              isOutOfStock
                                ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200'
                                : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/60 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md active:scale-95'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  {stock.brand}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                                    isOutOfStock
                                      ? 'bg-rose-100 text-rose-700'
                                      : isLowStock
                                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                  }`}
                                >
                                  {stock.stockQuantity} Adet
                                </span>
                              </div>

                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                                {stock.name}
                              </h4>
                              {stock.compatibleModel && (
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                  {stock.compatibleModel}
                                </p>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                                {stock.shelfLocation || 'Vitrin'}
                              </span>
                              <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                                {stock.sellPriceTRY} ₺
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 3. SEÇENEK: SIK KULLANILAN HIZLI TUŞLAR (PRESETS) */}
              {activeTab === 'presets' && (
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  <div className="mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Usta Tezgahı Hızlı Tuşlar (Tek Dokunuşla Sepete At)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sık yapılan cam montajı, kablo, adaptör veya servis işçilikleri
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {presetItems.map((pr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPreset(pr)}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-md transition active:scale-95 text-left flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-lg">{pr.icon}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              {pr.badge}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {pr.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {pr.type === 'service' ? 'İşçilik' : 'Ürün'}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <Plus className="w-3 h-3" /> Ekle
                          </span>
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                            {pr.price} ₺
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SAĞ TARAF: SEPET, MÜŞTERİ, İSKONTO, ÖDEME VE KASA (DESKTOP & MOBİL MODAL) */}
            <div className={`
              w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden
              ${showMobileCart ? 'fixed inset-0 z-50 flex' : 'hidden lg:flex'}
            `}>
              {/* Mobil Sepet Üst Başlık */}
              <div className="lg:hidden p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
                <span className="font-bold text-sm">Alışveriş Sepeti ({totalItemCount})</span>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Müşteri Seçici & Hızlı Müşteri Ekleme */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Müşteri</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQuickCustomerModal(!showQuickCustomerModal)}
                    className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>+ Hızlı Müşteri</span>
                  </button>
                </div>

                {showQuickCustomerModal ? (
                  <form onSubmit={handleCreateCustomer} className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                    <input
                      type="text"
                      placeholder="Ad Soyad"
                      value={newCustName}
                      onChange={e => setNewCustName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Telefon (05XX...)"
                      value={newCustPhone}
                      onChange={e => setNewCustPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="submit"
                        className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold"
                      >
                        Kaydet & Seç
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowQuickCustomerModal(false)}
                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-lg text-[11px]"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                ) : (
                  <select
                    value={selectedCustomerId}
                    onChange={e => setSelectedCustomerId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none"
                  >
                    <option value="retail">Perakende Müşteri (Hızlı İsimsiz)</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.phone})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* SEPET KALEMLERİ LİSTESİ */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 mb-1">
                  <span>Sepetteki Ürünler ({totalItemCount})</span>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Sepeti Temizle
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400">
                    <ShoppingCart className="w-8 h-8 mb-2 stroke-1 text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-bold">Sepetiniz boş</p>
                    <p className="text-[11px] text-slate-400">Soldan manuel giriş yapın veya ürün ekleyin</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-2 shadow-xs group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {item.isManual && (
                            <span className="px-1 py-0.2 text-[8px] font-extrabold uppercase rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0">
                              {item.itemType === 'service' ? 'İşçilik' : 'Manuel'}
                            </span>
                          )}
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.name}
                          </div>
                        </div>

                        {/* Fiyat Gösterimi ve Satır İçi Düzenleme */}
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                autoFocus
                                value={editingPriceValue}
                                onChange={e => setEditingPriceValue(e.target.value)}
                                onBlur={() => saveEditingPrice(item.id)}
                                onKeyDown={e => e.key === 'Enter' && saveEditingPrice(item.id)}
                                className="w-16 px-1 py-0.5 text-xs font-bold rounded border border-amber-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                              />
                              <button
                                onClick={() => saveEditingPrice(item.id)}
                                className="p-0.5 text-emerald-600"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEditingPrice(item)}
                              className="hover:text-amber-600 flex items-center gap-0.5 font-mono"
                              title="Fiyatı Değiştir"
                            >
                              <span>{item.unitPriceTRY} ₺</span>
                              <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition" />
                            </button>
                          )}

                          <span>x {item.quantity} =</span>
                          <span className="font-black text-slate-800 dark:text-slate-200">
                            {item.unitPriceTRY * item.quantity} ₺
                          </span>
                        </div>
                      </div>

                      {/* Adet Kontrolleri */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* FİYAT & ÖDEME BÖLÜMÜ */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shrink-0">
                
                {/* İndirim ve Not */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">İndirim (₺)</label>
                    <input
                      type="number"
                      min="0"
                      value={discountTRY || ''}
                      onChange={e => setDiscountTRY(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="0 TL"
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-rose-600 dark:text-rose-400 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kasiyer Notu</label>
                    <input
                      type="text"
                      value={cashierNote}
                      onChange={e => setCashierNote(e.target.value)}
                      placeholder="Opsiyonel not"
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Hızlı İndirim Kısayolları */}
                {subtotalTRY > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-bold">Hızlı İndirim:</span>
                    {[20, 50, 100].map(disc => (
                      <button
                        type="button"
                        key={disc}
                        onClick={() => setDiscountTRY(disc)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          discountTRY === disc 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        -{disc} ₺
                      </button>
                    ))}
                    {discountTRY > 0 && (
                      <button
                        type="button"
                        onClick={() => setDiscountTRY(0)}
                        className="text-[9px] text-slate-400 hover:underline ml-auto"
                      >
                        Temizle
                      </button>
                    )}
                  </div>
                )}

                {/* Ödeme Yöntemi Seçimi */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Ödeme Şekli</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nakit')}
                      className={`p-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-0.5 transition ${
                        paymentMethod === 'nakit'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      <span>Nakit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('kredi_karti')}
                      className={`p-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-0.5 transition ${
                        paymentMethod === 'kredi_karti'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Kart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('havale_eft')}
                      className={`p-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-0.5 transition ${
                        paymentMethod === 'havale_eft'
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Havale</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('veresiye')}
                      className={`p-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-0.5 transition ${
                        paymentMethod === 'veresiye'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Veresiye</span>
                    </button>
                  </div>
                </div>

                {/* Nakit Para Üstü Hesaplayıcı (Ödeme Nakit ise Görünür) */}
                {paymentMethod === 'nakit' && finalTotalTRY > 0 && (
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-500" />
                        Alınan Nakit:
                      </span>
                      <div className="flex items-center gap-1">
                        {[finalTotalTRY, 200, 500, 1000].map((quickCash, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setTenderedCash(quickCash.toString())}
                            className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                          >
                            {quickCash} ₺
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Verilen Para (₺)"
                        value={tenderedCash}
                        onChange={e => setTenderedCash(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      {tenderedNum > 0 && (
                        <div className="shrink-0 text-right">
                          <span className="text-[9px] text-slate-400 block">Para Üstü:</span>
                          <span className={`text-xs font-black font-mono ${changeTRY >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                            {changeTRY} ₺
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Toplam Tutar ve Onayla Butonu */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ödenecek Tutar</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      {finalTotalTRY} ₺
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={cart.length === 0 || !isTenderedEnough}
                    onClick={handleCheckout}
                    id="btn-complete-quick-sale"
                    className={`px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-2 transition shadow-md ${
                      cart.length === 0 || !isTenderedEnough
                        ? 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-500'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-500/25'
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Satışı Bitir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
