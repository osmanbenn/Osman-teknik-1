/**
 * WhatsApp Servis Arayüzü ve Soyutlama Katmanı (IWhatsAppService)
 * 
 * KRİTİK MİMARİ NOTU:
 * Türkiye'de teknik servis süreçlerinde WhatsApp bildirimleri doğrudan dükkân hattı üzerinden
 * ya da resmi Cloud API üzerinden gönderilebilir.
 * 
 * Bu arayüz sayesinde:
 * 1. Web Link Yöntemi (Varsayılan - Sıfır ban riski, doğrudan resmi wa.me protokolü)
 * 2. Unofficial Web/Baileys Wrapper (Dükkân hattı banlanma riski taşır, izole çalışır)
 * 3. Resmi Meta WhatsApp Business Cloud API (İleride kurumsal onay alındığında tek satırla geçiş yapılır)
 * 
 * Sistemdeki UI ve iş mantığı bu servis arayüzünden haberdardır, altyapı bağımsızdır.
 */

import { ServiceRecord } from '../types';

export interface WhatsAppMessagePayload {
  recipientPhone: string;
  messageText: string;
  serviceId?: string;
  templateType: 'kabul' | 'onarimda' | 'hazir' | 'teslim_edildi' | 'ozel';
}

export interface IWhatsAppService {
  /**
   * Müşteriye bildirim göndermek için mesaj metnini şablona göre üretir
   */
  generateMessage(service: ServiceRecord, templateType: 'kabul' | 'onarimda' | 'hazir' | 'teslim_edildi'): string;

  /**
   * Bildirimi tetikler (Web URL / wa.me linkini açar veya API isteği atar)
   */
  sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; url?: string; error?: string }>;

  /**
   * Servis sağlayıcısı bilgisi
   */
  getProviderName(): string;
}

export class DirectWhatsAppLinkService implements IWhatsAppService {
  private shopName: string = 'OSMANTEKNİK';
  private shopPhone: string = '0555 123 45 67';

  getProviderName(): string {
    return 'WhatsApp Direct Web/App Link (Sıfır Ban Riski)';
  }

  generateMessage(service: ServiceRecord, templateType: 'kabul' | 'onarimda' | 'hazir' | 'teslim_edildi'): string {
    const cleanId = service.id;
    const model = `${service.deviceBrand} ${service.deviceModel}`;
    const priceStr = service.estimatedCostTRY ? `${service.estimatedCostTRY} TL` : 'Belirlenmedi';

    switch (templateType) {
      case 'kabul':
        return `Merhaba Sayın *${service.customerName}*,\n\n*${this.shopName}* teknik servisimize teslim ettiğiniz *${model}* cihazınızın kabul kaydı yapılmıştır.\n\n📋 *Takip No:* ${cleanId}\n🔧 *Arıza:* ${service.issueDescription}\n💰 *Tahmini Tutar:* ${priceStr}\n\nCihazınız incelemeye alınmıştır. Durum güncellendiğinde sizi bilgilendireceğiz.\n\nİyi günler dileriz.`;

      case 'onarimda':
        return `Merhaba Sayın *${service.customerName}*,\n\n*${cleanId}* takip numaralı *${model}* cihazınızın teknisyenimiz tarafından onarım/parça değişim süreci başlatılmıştır.\n\nİşlemler tamamlandığında tekrar bilgi verilecektir.\n\n*${this.shopName}*`;

      case 'hazir':
        return `🎉 Sayın *${service.customerName}*,\n\nMÜJDE! *${cleanId}* takip numaralı *${model}* cihazınızın test ve onarım işlemleri başarıyla tamamlanmış olup *TESLİMAT İÇİN HAZIRDIR*.\n\n💰 *Tutar:* ${service.finalCostTRY ? `${service.finalCostTRY} TL` : priceStr}\n🏢 *Teslimat Adresi:* Dükkânımızdan mesai saatleri içinde teslim alabilirsiniz.\n\n*${this.shopName}*`;

      case 'teslim_edildi':
        return `Sayın *${service.customerName}*,\n\n*${cleanId}* numaralı *${model}* cihazınız teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür eder, iyi günlerde kullanmanızı dileriz.\n\nGaranti ve destek için fişinizi saklayınız.\n*${this.shopName}*`;

      default:
        return `Merhaba Sayın *${service.customerName}*, *${cleanId}* numaralı servis kaydınız hakkında bilgi vermek için ulaşıyoruz.`;
    }
  }

  async sendMessage(payload: WhatsAppMessagePayload): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Türkiye telefon formatını temizle: 05xx -> 905xx
      let phone = payload.recipientPhone.replace(/\D/g, '');
      if (phone.startsWith('0')) {
        phone = '90' + phone.substring(1);
      } else if (phone.length === 10) {
        phone = '90' + phone;
      }

      const encodedText = encodeURIComponent(payload.messageText);
      const url = `https://wa.me/${phone}?text=${encodedText}`;

      // Yeni sekmede aç
      window.open(url, '_blank', 'noopener,noreferrer');

      return { success: true, url };
    } catch (err: any) {
      return { success: false, error: err.message || 'WhatsApp açılamadı' };
    }
  }
}

// Global Singleton Provider (Gerektiğinde Resmi API veya Baileys adapter ile değiştirilebilir)
export const whatsappService: IWhatsAppService = new DirectWhatsAppLinkService();
