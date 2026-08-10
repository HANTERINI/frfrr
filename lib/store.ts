import { kv } from '@vercel/kv'

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

export async function getProfiles(): Promise<Profile[]> {
  try {
    const profiles = await kv.get<Profile[]>(KV_KEY)
    return profiles || []
  } catch (e) {
    console.error('KV Error:', e)
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
  
  await kv.set(KV_KEY, [...profiles, newProfile])
  return newProfile
}

export async function deleteProfile(id: string) {
  const profiles = await getProfiles()
  const filtered = profiles.filter(p => p.id !== id)
  await kv.set(KV_KEY, filtered)
}
