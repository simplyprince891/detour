import { Request, Response } from 'express'
import { z } from 'zod'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const refreshSchema = z.object({
  refreshToken: z.string(),
})

export async function register(req: Request, res: Response) {
  const { email, password, displayName } = registerSchema.parse(req.body)
  const result = await authService.register(email, password, displayName)
  res.status(201).json(result)
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)
  const result = await authService.login(email, password)
  res.json(result)
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body)
  const tokens = await authService.refresh(refreshToken)
  res.json(tokens)
}
