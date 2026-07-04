import { query, queryOne } from '../config/database'

export interface UserRow {
  id: string
  email: string
  password_hash: string
  display_name: string
  created_at: string
  updated_at: string
}

export const UserModel = {
  async findByEmail(email: string): Promise<UserRow | null> {
    return queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [email])
  },

  async findById(id: string): Promise<UserRow | null> {
    return queryOne<UserRow>('SELECT * FROM users WHERE id = $1', [id])
  },

  async create(email: string, passwordHash: string, displayName: string): Promise<UserRow> {
    const rows = await query<UserRow>(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email, passwordHash, displayName]
    )
    return rows[0]
  },
}
