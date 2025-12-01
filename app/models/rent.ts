import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import console from './console.js'
import user from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Rent extends BaseModel {
  public static table = 'rents'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare console_id: number

  @column.dateTime()
  declare rent_date: DateTime

  @column()
  declare hours: number

  @belongsTo(() => console, { foreignKey: 'console_id' })
  public console!: BelongsTo<typeof console>

  @belongsTo(() => user, { foreignKey: 'user_id' })
  public user!: BelongsTo<typeof user>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
