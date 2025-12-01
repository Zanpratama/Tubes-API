import { HttpContext } from '@adonisjs/core/http'
import rent from '#models/rent'

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
    const data = request.only(['user_id', 'console_id', 'rent_date', 'hours'])
    const rents = await rent.create(data)
    return response.status(201).json(rents)
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
