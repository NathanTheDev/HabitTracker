
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const tokens = await yourAuthService.login(username, password)

  cookies().set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return Response.json({ accessToken: tokens.accessToken })
};

