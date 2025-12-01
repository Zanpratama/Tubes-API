import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Console extends BaseModel {
  public static table = 'consoles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price_per_hour: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
