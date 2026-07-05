import path from 'node:path'
import dotenv from 'dotenv'

const nodeEnv = process.env.NODE_ENV ?? 'development'

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), quiet: true })
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${nodeEnv}`),
  quiet: true,
})

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv,
  isProd: nodeEnv === 'production',
  serverUrl: process.env.SERVER_URL ?? 'http://localhost:3001',
  webUrl: process.env.WEB_URL ?? 'http://localhost:3000',
  jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET),
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
  },
}
