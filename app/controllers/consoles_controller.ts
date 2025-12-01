import { HttpContext } from '@adonisjs/core/http'
import console from '#models/console'

export default class consolescontroller {
  public async index({ response }: HttpContext) {
    const consoles = await console.all()
    return response.json(consoles)
  }

  public async show({ params, response }: HttpContext) {
    const consoles = await console.find(params.id)
    if (!consoles) {
      return response.status(404).json({ message: 'Console not found' })
    }
    return response.json(consoles)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'price_per_hour'])
    const consoles = await console.create(data)
    return response.status(201).json(consoles)
  }

  public async update({ params, request, response }: HttpContext) {
    const consoles = await console.find(params.id)
    if (!consoles) {
      return response.status(404).json({ message: 'Console not found' })
    }

    const data = request.only(['name', 'price_per_hour'])
    consoles.merge(data)
    await consoles.save()
    return response.json(consoles)
  }

  public async destroy({ params, response }: HttpContext) {
    const consoles = await console.find(params.id)
    if (!consoles) {
      return response.status(404).json({ message: 'Console not found' })
    }

    await consoles.delete()
    return response.status(204)
  }
}
