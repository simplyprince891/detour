import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server as SocketServer } from 'socket.io'
import { config } from './config'
import { errorHandler, notFound } from './middleware/errorHandler'
import authRoutes from './routes/auth.routes'
import matchRoutes from './routes/match.routes'
import teamRoutes from './routes/team.routes'
import chatRoutes from './routes/chat.routes'
import streamRoutes from './routes/stream.routes'
import streamedRoutes from './routes/streamed.routes'
import moviesRoutes from './routes/movies.routes'
import { LiveService } from './services/live.service'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: { origin: '*' },
  path: '/ws',
})

app.use(cors())
app.use(express.json())

// REST routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/matches', matchRoutes)
app.use('/api/v1/teams', teamRoutes)
app.use('/api/v1/matches', chatRoutes)
app.use('/api/v1/streams', streamRoutes)
app.use('/api/v1/streamed', streamedRoutes)
app.use('/api/v1/movies', moviesRoutes)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// WebSocket — Live Match Updates
const liveService = new LiveService()

io.of(/^\/ws\/matches\/(.+)\/live$/).on('connection', (socket) => {
  const matchId = socket.nsp.name.match(/\/ws\/matches\/(.+)\/live/)?.[1]
  if (!matchId) return

  socket.join(`match:${matchId}`)
  liveService.startPolling(matchId, (data) => {
    io.of(socket.nsp.name).emit('MATCH_UPDATE', data)
  })

  socket.on('disconnect', () => {
    socket.leave(`match:${matchId}`)
  })
})

// WebSocket — Chat
io.of(/^\/ws\/matches\/(.+)\/chat$/).on('connection', (socket) => {
  const matchId = socket.nsp.name.match(/\/ws\/matches\/(.+)\/chat/)?.[1]
  if (!matchId) return

  socket.join(`chat:${matchId}`)

  socket.on('CHAT_SEND', (payload: { message: string }) => {
    io.of(socket.nsp.name).emit('CHAT_MESSAGE', {
      userId: socket.data.user?.sub,
      message: payload.message,
      timestamp: new Date().toISOString(),
    })
  })

  socket.on('disconnect', () => {
    socket.leave(`chat:${matchId}`)
  })
})

app.use(notFound)
app.use(errorHandler)

server.listen(config.port, () => {
  console.log(`World Cup 2026 API running on port ${config.port}`)
})

export { app, server, io }
