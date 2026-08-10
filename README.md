# FRP-FAST Vercel Edition

Удобная панель управления для FRP, адаптированная для Vercel. Позволяет управлять туннелями без необходимости покупки дорогого VPS.

## Особенности
- 🚀 **Zero VPS**: Используйте Vercel для управления и мониторинга.
- 🛠 **Web UI**: Красивый интерфейс в стиле терминала.
- 🔒 **Secure**: Поддержка WebSocket + TLS (WSS) для обхода ограничений.
- 💾 **Stateless**: Интеграция с Vercel KV для хранения профилей.

## Установка

1. Склонируйте этот репозиторий.
2. Создайте новый проект на Vercel и подключите Vercel KV.
3. Добавьте переменные окружения из настроек KV.
4. Выполните `vercel --prod`.

## Как это работает?

Вместо стандартного TCP протокола, эта версия использует **WebSockets**. Vercel поддерживает WebSockets в Edge функциях, что позволяет `frpc` (клиенту) подключаться напрямую к вашему домену на Vercel.

### Настройка клиента (frpc.toml):
```toml
[common]
server_addr = your-vercel-domain.vercel.app
server_port = 443
protocol = websocket
token = your_token
tls_enable = true

[myservice]
type = http
local_ip = 127.0.0.1
local_port = 8080
custom_domains = your-vercel-domain.vercel.app
```

## Управление
Откройте ваш домен на Vercel в браузере. Вы увидите панель управления, аналогичную скрипту `frp-fast`, но в веб-интерфейсе.
