import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-access',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'worldcup2026',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  sportsApi: {
    sportradar: {
      baseUrl: 'https://api.sportradar.us/soccer/trial/v4',
      apiKey: process.env.SPORTRADAR_API_KEY || '',
    },
    footballData: {
      baseUrl: 'https://api.football-data.org/v4',
      apiKey: process.env.FOOTBALL_DATA_API_KEY || '',
    },
  },

  tmdb: {
    accessToken: process.env.TMDB_ACCESS_TOKEN || '',
  },

  streamed: {
    baseUrl: process.env.STREAMED_BASE_URL || 'https://streamed.pk',
  },

  fcm: {
    serverKey: process.env.FCM_SERVER_KEY || '',
  },
}
