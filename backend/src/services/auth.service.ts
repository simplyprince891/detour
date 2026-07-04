import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { config } from '../config'
import { UserModel } from '../models/User'
import { query } from '../config/database'
import { AuthTokens, JwtPayload } from '../types'

export class AuthService {
  async register(email: string, password: string, displayName: string) {
    const existing = await UserModel.findByEmail(email)
    if (existing) {
      throw Object.assign(new Error('Email already in use'), { statusCode: 409, code: 'DUPLICATE_EMAIL' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await UserModel.create(email, passwordHash, displayName)
    const tokens = await this.generateTokens(user.id, user.email)

    return {
      user: { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at },
      ...tokens,
    }
  }

  async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 })
    }

    const tokens = await this.generateTokens(user.id, user.email)
    return {
      user: { id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at },
      ...tokens,
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload

    // Verify token exists in DB
    const rows = await query<any>(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
      [refreshToken, payload.sub]
    )
    if (!rows.length) {
      throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 })
    }

    // Rotate refresh token
    await query('DELETE FROM refresh_tokens WHERE id = $1', [rows[0].id])
    return this.generateTokens(payload.sub, payload.email)
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessToken = jwt.sign(
      { sub: userId, email } as JwtPayload,
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn }
    )

    const refreshToken = jwt.sign(
      { sub: userId, email } as JwtPayload,
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    )

    // Store refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, refreshToken, expiresAt]
    )

    return { accessToken, refreshToken }
  }
}
