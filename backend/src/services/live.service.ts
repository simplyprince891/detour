import { StreamedService } from './streamed.service'

export class LiveService {
  private pollIntervals: Map<string, NodeJS.Timeout> = new Map()
  private streamed = new StreamedService()

  async startPolling(matchId: string, onUpdate: (data: any) => void): Promise<void> {
    if (this.pollIntervals.has(matchId)) return

    const poll = async () => {
      try {
        const match = await this.streamed.getMatchById(matchId)
        if (match) onUpdate(match)
      } catch (err) {
        console.error(`Live poll error for match ${matchId}:`, err)
      }
    }

    await poll()
    const interval = setInterval(poll, 30_000)
    this.pollIntervals.set(matchId, interval)
  }

  stopPolling(matchId: string): void {
    const interval = this.pollIntervals.get(matchId)
    if (interval) {
      clearInterval(interval)
      this.pollIntervals.delete(matchId)
    }
  }
}
