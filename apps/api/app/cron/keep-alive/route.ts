import { log } from '@repo/observability/log'
import { database } from '@repo/database'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * This endpoint is designed to be called by a cron job to keep the API
 * server alive. It's useful for serverless environments where the server
 * might go to sleep after a period of inactivity.
 *
 * You can set up a cron job to call this endpoint every few minutes to
 * ensure the server stays warm.
 */
export const GET = async () => {
  log.info('Keep alive endpoint called')

  const newPage = await database.page.create({
    data: {
      name: 'cron-temp',
    },
  })

  await database.page.delete({
    where: {
      id: newPage.id,
    },
  })

  return NextResponse.json({ status: 'OK' }, { status: 200 })
}
