/**
 * UNICOU Mail Dispatch Service (Production Node)
 * This service dynamically retrieves configuration from the System Settings.
 */

export const SYSTEM_CONFIG_KEY = 'unicou_system_infrastructure_v1';

export interface MailConfig {
  serviceId: string;
  templateId_verification: string;
  templateId_voucher: string;
  templateId_hold?: string;
  templateId_rejected?: string;
  publicKey: string;
}

export class MailService {
  private static activeVerificationCodes: Record<string, string> = {};

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
    const emailKey = userEmail.toLowerCase();
    this.activeVerificationCodes[emailKey] = code;
    
    const config = this.getConfigs();

    // Check for real configuration
    if (!config || !config.serviceId || config.serviceId.includes('YOUR_') || config.serviceId === '') {
      console.warn("--- UNICOU SECURITY PROTOCOL: MAIL NODE NOT CONFIGURED ---");
      console.info(`[INBOX SIMULATION] Code for ${userEmail}: ${code}`);
      // Throw error so the Signup component can tell the owner to configure it in Admin settings
      throw new Error("MAIL_NODE_UNCONFIGURED");
    }

    try {
      await this.dispatch(config.serviceId, config.templateId_verification, config.publicKey, {
        to_name: userName || 'New User',
        to_email: userEmail,
        verification_code: code,
        subject: "Your UNICOU Verification Code"
      });
    } catch (e) {
      console.error("EmailJS Dispatch Failed.", e);
      throw new Error("TRANSMISSION_FAILED");
    }
  }

  /**
   * Validation logic for the entered code.
   */
  static verifyStoredCode(email: string, inputCode: string): boolean {
    const stored = this.activeVerificationCodes[email.toLowerCase()];
    const isValid = stored === inputCode;
    if (isValid) {
      delete this.activeVerificationCodes[email.toLowerCase()];
    }
    return isValid;
  }

  /**
   * Dispatches order status update emails.
   */
  static async sendOrderStatusEmail(userName: string, userEmail: string, orderId: string, status: 'Approved' | 'Hold' | 'Rejected', voucherCodes?: string[]) {
    const config = this.getConfigs();
    const hasRealConfig = config && config.serviceId && config.serviceId !== '' && !config.serviceId.includes('YOUR_');

    if (!hasRealConfig) {
      console.warn(`--- ORDER ${status.toUpperCase()}: LOCAL NOTIFICATION ---`);
      return { success: true, mode: 'local' };
    }

    let templateId = config.templateId_voucher; 
    if (status === 'Hold') templateId = config.templateId_hold || config.templateId_voucher;
    if (status === 'Rejected') templateId = config.templateId_rejected || config.templateId_voucher;

    return this.dispatch(config.serviceId, templateId, config.publicKey, {
      to_name: userName,
      to_email: userEmail,
      order_id: orderId,
      status: status,
      voucher_codes: voucherCodes ? voucherCodes.join(', ') : 'N/A',
      subject: `Order Update: ${orderId} is now ${status}`
    });
  }

  private static async dispatch(serviceId: string, templateId: string, publicKey: string, params: any) {
    if (!templateId) return;
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