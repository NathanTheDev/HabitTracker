
import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('refreshToken')
  return Response.json({ success: true })
}

