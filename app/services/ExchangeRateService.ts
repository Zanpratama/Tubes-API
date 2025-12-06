import axios from 'axios'
import Env from '#start/env'

export default class ExchangeRateService {
  public static async getRate(base: string = 'IDR', target: string = 'USD') {
    const API_KEY = Env.get('EXCHANGE_RATE_KEY')

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${base}/${target}`

    const response = await axios.get(url)
    return response.data
  }
}
