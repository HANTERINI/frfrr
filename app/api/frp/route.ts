import { NextResponse } from 'next/server'

// WebSocket-эндпоинт для подключения frpc
// В данной версии используется как заглушка контрольного канала
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'FRP WebSocket endpoint. Use frpc with protocol=websocket to connect.',
    protocol: 'wss',
    port: 443
  })
}

export const dynamic = 'force-dynamic'
