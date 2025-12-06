import type { HttpContext } from '@adonisjs/core/http'
import ExchangeRateService from '#services/ExchangeRateService'

export default class ExchangeController {
  public async convert({ request, response }: HttpContext) {
    const base = request.input('base', 'IDR')
    const target = request.input('target', 'USD')

    try {
      const data = await ExchangeRateService.getRate(base, target)
      return response.json({
        success: true,
        result: data,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Error fetching exchange rate',
      })
    }
  }
}
