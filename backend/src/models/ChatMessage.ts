import { query } from '../config/database'

export const ChatMessageModel = {
  async findByMatch(matchId: string, limit = 50, before?: string): Promise<any[]> {
    const params: any[] = [matchId, limit]
    let condition = ''
    if (before) {
      condition = 'AND cm.created_at < $3'
      params.push(before)
    }
    return query<any>(
      `SELECT cm.*, u.display_name
       FROM chat_messages cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.match_id = $1 ${condition}
       ORDER BY cm.created_at DESC
       LIMIT $2`,
      params
    )
  },

  async create(matchId: string, userId: string, message: string): Promise<any> {
    const rows = await query<any>(
      `INSERT INTO chat_messages (match_id, user_id, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [matchId, userId, message]
    )
    return rows[0]
  },
}
