import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const existing = await User.findBy('email', email)
    if (existing) {
      return response.status(400).json({ message: 'Email already exists' })
    }

    const hashedPassword = await hash.make(password)
    const user = await User.create({ name, email, password: hashedPassword })
    return response.status(201).json({
      message: 'User registered successfully',
      user: user,
    })
  }

  public async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(400).json({ message: 'Invalid email' })
    }

    const passwordVerified = await hash.verify(user.password, password)
    if (!passwordVerified) {
      return response.status(400).json({ message: 'Invalid password' })
    }

    const token = await auth.use('api').createToken(user)

    return response.json({
      message: 'login successful',
      token,
    })
  }

  public async me({ auth, response }: HttpContext): Promise<void> {
    try {
      const user = auth.user
      return response.json(user)
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.json({ message: 'Logged out successfully' })
  }
}
