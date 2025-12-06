import axios from 'axios'
import env from '#start/env'

export default class TelegramService {
  private static botToken = env.get('TELEGRAM_BOT_TOKEN')
  private static chatId = env.get('TELEGRAM_CHAT_ID')
  private static baseUrl = `https://api.telegram.org/bot${this.botToken}`

  /**
   * Send notification message to Telegram
   */
  static async sendNotification(message: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/sendMessage`
      
      await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML', // Mendukung formatting HTML
      })

      console.log('✅ Telegram notification sent successfully')
    } catch (error) {
      console.error('❌ Failed to send Telegram notification:', error)
      // Tidak throw error agar proses rental tetap berjalan
      // meskipun notifikasi gagal
    }
  }

  /**
   * Send formatted rental notification
   */
  static async sendRentalNotification(data: {
    userId: number
    consoleId: number
    duration: number
    rentalDate: string
    consoleName?: string
    userName?: string
  }): Promise<void> {
    const message = `
🔔 <b>Rental Baru!</b>

👤 User: ${data.userName || `ID ${data.userId}`}
🎮 Console: ${data.consoleName || `ID ${data.consoleId}`}
⏱ Durasi: ${data.duration} jam
📅 Tanggal: ${data.rentalDate}

<i>Notifikasi otomatis dari Console Rental System</i>
    `.trim()

    await this.sendNotification(message)
  }
}