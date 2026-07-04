import { Request, Response } from 'express'
import { z } from 'zod'
import { ChatService } from '../services/chat.service'

const chatService = new ChatService()

const sendMessageSchema = z.object({
  message: z.string().min(1).max(500),
})

export async function getMessages(req: Request, res: Response) {
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200)
  const before = req.query.before as string | undefined
  const messages = await chatService.getMessages(req.params.matchId, limit, before)
  res.json({ messages })
}

export async function sendMessage(req: Request, res: Response) {
  const { message } = sendMessageSchema.parse(req.body)
  const result = await chatService.sendMessage(
    req.params.matchId,
    req.user!.sub,
    req.user!.email,
    message
  )
  res.status(201).json({ message: result })
}
