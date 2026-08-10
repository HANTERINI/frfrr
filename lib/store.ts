import { Redis } from '@upstash/redis'

const KV_KEY = 'frp_profiles'

export interface Profile {
  id: string
  name: string
  type: string
  local_ip: string
  local_port: number
  remote_port: number
  token: string
  status: 'active' | 'inactive'
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    return null
  }
  return new Redis({ url, token })
}

export async function getProfiles(): Promise<Profile[]> {
  try {
    const redis = getRedis()
    if (!redis) return []
    const profiles = await redis.get<Profile[]>(KV_KEY)
    return profiles || []
  } catch (e) {
    console.error('Redis Error:', e)
    return []
  }
}

export async function saveProfile(profile: Partial<Profile>) {
  const profiles = await getProfiles()
  const newProfile = {
    ...profile,
    id: Math.random().toString(36).substring(2, 9),
    status: 'inactive'
  } as Profile

  const redis = getRedis()
  if (redis) {
    await redis.set(KV_KEY, [...profiles, newProfile])
  }
  return newProfile
}

export async function deleteProfile(id: string) {
  const profiles = await getProfiles()
  const filtered = profiles.filter(p => p.id !== id)
  const redis = getRedis()
  if (redis) {
    await redis.set(KV_KEY, filtered)
  }
}
