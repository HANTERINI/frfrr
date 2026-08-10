import { NextResponse } from 'next/server'
import { getProfiles, saveProfile, deleteProfile } from '@/lib/store'

export async function GET() {
  const profiles = await getProfiles()
  return NextResponse.json(profiles)
}

export async function POST(req: Request) {
  const body = await req.json()
  const profile = await saveProfile(body)
  return NextResponse.json(profile)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    await deleteProfile(id)
  }
  return NextResponse.json({ success: true })
}
