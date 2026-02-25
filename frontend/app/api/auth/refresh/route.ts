
import { cookies } from 'next/headers'

export async function POST() {
  const refreshToken = cookies().get('refreshToken')?.value
  if (!refreshToken) return Response.json({ error: 'No refresh token' }, { status: 401 })

  const tokens = await yourAuthService.refresh(refreshToken)

  return Response.json({ accessToken: tokens.accessToken })
}

