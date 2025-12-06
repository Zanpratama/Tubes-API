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

      // Format tanggal
      let formattedDate = data.rent_date
      
      if (rents.rent_date && typeof rents.rent_date.toFormat === 'function') {
        formattedDate = rents.rent_date.toFormat('dd MMM yyyy HH:mm')
      } else if (typeof data.rent_date === 'string') {
        formattedDate = DateTime.fromISO(data.rent_date).toFormat('dd MMM yyyy HH:mm')
      }

      // Kirim notifikasi Telegram - CREATE
      console.log('📤 Sending Telegram notification (CREATE)...')
      const createMessage = `
🆕 <b>Rental Baru Dibuat!</b>

👤 User: ${rents.user?.name || `ID ${rents.user_id}`}
🎮 Console: ${rents.console?.name || `ID ${rents.console_id}`}
⏱ Durasi: ${rents.hours} jam
📅 Tanggal: ${formattedDate}

<i>Rental ID: #${rents.id}</i>
      `.trim()

      await TelegramService.sendNotification(createMessage)

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
  try {
    const rents = await rent.find(params.id)
    if (!rents) {
      return response.status(404).json({ Message: 'Rent not found' })
    }

    // Load relations BEFORE update
    await rents.load('user')
    await rents.load('console')

    // Simpan data LAMA untuk comparison
    const oldData = {
      consoleName: rents.console?.name,
      hours: rents.hours,
      rentDate: rents.rent_date?.toFormat?.('dd MMM yyyy HH:mm') || '',
    }

    // Update data
    const data = request.only(['user_id', 'console_id', 'rent_date', 'hours'])
    rents.merge(data)
    await rents.save()

    // Reload relations after update
    await rents.load('user')
    await rents.load('console')

    // Format tanggal BARU
    let formattedDate = data.rent_date
    if (rents.rent_date && typeof rents.rent_date.toFormat === 'function') {
      formattedDate = rents.rent_date.toFormat('dd MMM yyyy HH:mm')
    } else if (typeof data.rent_date === 'string') {
      formattedDate = DateTime.fromISO(data.rent_date).toFormat('dd MMM yyyy HH:mm')
    }

    // Kirim notifikasi dengan BEFORE/AFTER
    console.log('📤 Sending Telegram notification (UPDATE)...')
    const updateMessage = `
✏️ <b>Rental Diubah!</b>

👤 User: ${rents.user?.name || `ID ${rents.user_id}`}

<b>Perubahan:</b>
🎮 Console: ${oldData.consoleName} → ${rents.console?.name}
⏱ Durasi: ${oldData.hours} jam → ${rents.hours} jam
📅 Tanggal: ${oldData.rentDate} → ${formattedDate}

<i>Rental ID: #${rents.id}</i>
<i>Diupdate pada: ${DateTime.now().toFormat('dd MMM yyyy HH:mm')}</i>
    `.trim()

    await TelegramService.sendNotification(updateMessage)

    return response.json(rents)
  } catch (error) {
    console.error('❌ Error in update method:', error)
    return response.status(500).json({
      message: 'Failed to update rent',
      error: error.message,
    })
  }
}

  public async destroy({ params, response }: HttpContext) {
    try {
      const rents = await rent.find(params.id)
      if (!rents) {
        return response.status(404).json({ Message: 'Rent not found' })
      }

      // Load relations BEFORE delete
      await rents.load('user')
      await rents.load('console')

      // Format tanggal
      let formattedDate = ''
      if (rents.rent_date && typeof rents.rent_date.toFormat === 'function') {
        formattedDate = rents.rent_date.toFormat('dd MMM yyyy HH:mm')
      }

      // Simpan info untuk notifikasi
      const rentInfo = {
        id: rents.id,
        userName: rents.user?.name,
        userId: rents.user_id,
        consoleName: rents.console?.name,
        consoleId: rents.console_id,
        hours: rents.hours,
        rentDate: formattedDate,
      }

      // DELETE rental
      await rents.delete()

      // Kirim notifikasi Telegram - DELETE
      console.log('📤 Sending Telegram notification (DELETE)...')
      const deleteMessage = `
🗑️ <b>Rental Dihapus!</b>

👤 User: ${rentInfo.userName || `ID ${rentInfo.userId}`}
🎮 Console: ${rentInfo.consoleName || `ID ${rentInfo.consoleId}`}
⏱ Durasi: ${rentInfo.hours} jam
📅 Tanggal: ${rentInfo.rentDate}

<i>Rental ID: #${rentInfo.id} telah dibatalkan</i>
<i>Dihapus pada: ${DateTime.now().toFormat('dd MMM yyyy HH:mm')}</i>
      `.trim()

      await TelegramService.sendNotification(deleteMessage)

      return response.status(204)
    } catch (error) {
      console.error('❌ Error in destroy method:', error)
      return response.status(500).json({
        message: 'Failed to delete rent',
        error: error.message,
      })
    }
  }
}