import { ChatMessageModel } from '../models/ChatMessage'

export class ChatService {
  async getMessages(matchId: string, limit = 50, before?: string) {
    const rows = await ChatMessageModel.findByMatch(matchId, limit, before)
    return rows.map((r: any) => ({
      id: r.id,
      matchId: r.match_id,
      userId: r.user_id,
      displayName: r.display_name,
      message: r.message,
      createdAt: r.created_at,
    }))
  }

  async sendMessage(matchId: string, userId: string, displayName: string, message: string) {
    const row = await ChatMessageModel.create(matchId, userId, message)
    return {
      id: row.id,
      matchId: row.match_id,
      userId: row.user_id,
      displayName,
      message: row.message,
      createdAt: row.created_at,
    }
  }
}
