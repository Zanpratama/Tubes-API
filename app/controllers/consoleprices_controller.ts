import type { HttpContext } from '@adonisjs/core/http'
import ExchangeRateService from '#services/ExchangeRateService'
import consoles from '#models/console'

export default class ConsolePriceController {
  public async convert({ params, request, response }: HttpContext) {
    const targetCurrency = request.input('currency', 'USD') // default USD

    // Cari console berdasarkan ID
    const consoleItem = await consoles.find(params.id)

    if (!consoleItem) {
      return response.status(404).json({
        success: false,
        message: 'Console not found',
      })
    }

    // Harga per jam dalam IDR
    const priceIDR = consoleItem.price_per_hour

    // Panggil API ExchangeRate
    const data = await ExchangeRateService.getRate('IDR', targetCurrency)
    const rate = data.conversion_rate

    const convertedPrice = priceIDR * rate

    return response.json({
      console: consoleItem.name,
      price_per_hour_idr: priceIDR,
      target_currency: targetCurrency,
      conversion_rate: rate,
      converted_price_per_hour: convertedPrice,
    })
  }
}
