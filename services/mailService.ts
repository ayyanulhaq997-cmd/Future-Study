
/**
 * UNICOU Mail Dispatch Service (Production Node)
 * This service dynamically retrieves configuration from the System Settings.
 */

const SYSTEM_CONFIG_KEY = 'unicou_system_infrastructure_v1';

export interface MailConfig {
  serviceId: string;
  templateId_verification: string;
  templateId_voucher: string;
  publicKey: string;
}

export class MailService {
  private static activeVerificationCodes: Record<string, string> = {};
  public static lastCodeDispatched: string | null = null; // For Developer Helper UI

  private static getConfigs(): MailConfig | null {
    const raw = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Generates and sends a 6-digit verification code.
   */
  static async sendVerificationCode(userName: string, userEmail: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.activeVerificationCodes[userEmail.toLowerCase()] = code;
    this.lastCodeDispatched = code;

    const config = this.getConfigs();

    // Check for real configuration
    if (!config || !config.serviceId || config.serviceId === 'YOUR_SERVICE_ID' || config.serviceId === '') {
      console.warn("--- UNICOU SECURITY PROTOCOL: LOCAL DISPATCH MODE ---");
      console.info(`[INBOX SIMULATION] Verification Code for ${userEmail}: ${code}`);
      return; 
    }

    await this.dispatch(config.serviceId, config.templateId_verification, config.publicKey, {
      to_name: userName || 'New User',
      to_email: userEmail,
      verification_code: code,
      subject: "Your UNICOU Verification Code"
    });
  }

  /**
   * Validation logic for the entered code.
   */
  static verifyStoredCode(email: string, inputCode: string): boolean {
    const stored = this.activeVerificationCodes[email.toLowerCase()];
    const isValid = stored === inputCode;
    if (isValid) {
      delete this.activeVerificationCodes[email.toLowerCase()];
      this.lastCodeDispatched = null;
    }
    return isValid;
  }

  /**
   * Dispatches official voucher codes to the registered student email.
   */
  static async sendVoucherEmail(userName: string, userEmail: string, productName: string, codes: string[], orderId: string) {
    const config = this.getConfigs();

    if (!config || !config.serviceId || config.serviceId === '' || config.serviceId === 'YOUR_SERVICE_ID') {
      console.warn("--- VOUCHER DISPATCH: LOCAL MODE ---");
      console.info(`[INBOX SIMULATION] Vouchers for ${userEmail}: ${codes.join(', ')}`);
      return { success: true, mode: 'local' };
    }

    return this.dispatch(config.serviceId, config.templateId_voucher, config.publicKey, {
      to_name: userName,
      to_email: userEmail,
      product_name: productName,
      voucher_codes: codes.join(', '),
      order_id: orderId,
      subject: `Official Voucher Delivery: ${productName}`
    });
  }

  private static async dispatch(serviceId: string, templateId: string, publicKey: string, params: any) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: params
        })
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(`EmailJS rejection: ${errData}`);
      }
      return { success: true };
    } catch (error) {
      console.error("CRITICAL MAILER ERROR:", error);
      throw error;
    }
  }
}
