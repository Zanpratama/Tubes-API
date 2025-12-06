import { HttpContext } from '@adonisjs/core/http'
import rent from '#models/rent'
import TelegramService from '#services/telegram_service'
import { DateTime } from 'luxon'

export default class rentscontroller {
  public async index({ response }: HttpContext) {
    const rents = await rent.query().preload('user').preload('console')
    return response.json(rents)
  }

  public async show({ params, response }: HttpContext) {
    const rents = await rent
      .query()
      .where('id', params.id)
      .preload('user')
      .preload('console')
      .first()

    if (!rents) {
      return response.status(404).json({ message: 'Rent not found' })
    }

    return response.json(rents)
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['user_id', 'console_id', 'rent_date', 'hours'])
      const rents = await rent.create(data)

      // Load relations untuk mendapatkan nama user & console
      await rents.load('user')
      await rents.load('console')

      // Format tanggal - cek property name yang benar
      let formattedDate = data.rent_date
      
      // Jika rent_date adalah DateTime object
      if (rents.rent_date && typeof rents.rent_date.toFormat === 'function') {
        formattedDate = rents.rent_date.toFormat('dd MMM yyyy')
      } 
      // Jika masih string, parse dulu
      else if (typeof data.rent_date === 'string') {
        formattedDate = DateTime.fromISO(data.rent_date).toFormat('dd MMM yyyy')
      }

      // Kirim notifikasi Telegram
      console.log('📤 Sending Telegram notification...')
      await TelegramService.sendRentalNotification({
        userId: rents.user_id,
        consoleId: rents.console_id,
        duration: rents.hours,
        rentalDate: formattedDate,
        consoleName: rents.console?.name
      })

      return response.status(201).json(rents)
    } catch (error) {
      console.error('❌ Error in store method:', error)
      return response.status(500).json({
        message: 'Failed to create rent',
        error: error.message,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    const rents = await rent.find(params.id)
    if (!rents) {
      return response.status(404).json({ Message: 'Rent not found' })
    }
    const data = request.only(['user_id', 'console_id', 'rent_date', 'hours'])
    rents.merge(data)
    await rents.save()
    return response.json(rents)
  }

  public async destroy({ params, response }: HttpContext) {
    const rents = await rent.find(params.id)
    if (!rents) {
      return response.status(404).json({ Message: 'Rent not found' })
    }
    await rents.delete()
    return response.status(204)
  }
}