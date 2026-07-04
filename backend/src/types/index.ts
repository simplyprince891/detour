// ===== ENUMS =====

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'HALFTIME' | 'FINISHED' | 'POSTPONED'
export type MatchStage =
  | 'GROUP_STAGE' | 'ROUND_OF_16' | 'QUARTER_FINAL'
  | 'SEMI_FINAL' | 'THIRD_PLACE' | 'FINAL'
export type GoalType = 'GOAL' | 'OWN_GOAL' | 'PENALTY' | 'FREE_KICK' | 'HEADER'
export type CommentaryType = 'COMMENTARY' | 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'HALFTIME' | 'FULLTIME'
export type NotificationType = 'GENERAL' | 'MATCH_REMINDER' | 'GOAL_ALERT' | 'LINEUP_ANNOUNCED'
export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW'

// ===== AUTH =====

export interface JwtPayload {
  sub: string       // user id
  email: string
  iat?: number
  exp?: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// ===== DOMAIN MODELS =====

export interface User {
  id: string
  email: string
  displayName: string
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  code: string
  flagUrl: string | null
  groupName: string | null
}

export interface Player {
  id: string
  teamId: string
  name: string
  position: PlayerPosition | null
  jerseyNumber: number | null
  photoUrl: string | null
}

export interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  datetime: string
  status: MatchStatus
  stage: MatchStage
  venue: string | null
  homeScore: number | null
  awayScore: number | null
  groupName: string | null
}

export interface MatchDetail extends Match {
  homeLineup: LineupPlayer[]
  awayLineup: LineupPlayer[]
  goals: Goal[]
  commentaries: Commentary[]
}

export interface LineupPlayer {
  playerId: string
  name: string
  position: PlayerPosition | null
  jerseyNumber: number | null
  isStarting: boolean
}

export interface Goal {
  id: string
  matchId: string
  playerId: string | null
  teamId: string
  minute: number
  type: GoalType
  scorerName?: string
}

export interface Commentary {
  id: string
  matchId: string
  minute: number
  text: string
  type: CommentaryType
}

export interface ChatMessage {
  id: string
  matchId: string
  userId: string
  displayName: string
  message: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string | null
  type: NotificationType
  read: boolean
  createdAt: string
}

// ===== API RESPONSE SHAPES =====

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  error: string
  code?: string
  details?: { field: string; message: string }[]
}
