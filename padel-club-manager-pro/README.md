# Padel Club Manager Pro

Este proyecto está basado en [OpenSaas](https://opensaas.sh) y está diseñado como un sistema integral de gestión para clubes de pádel.

## Estructura del Proyecto

Este proyecto consiste en tres directorios principales:
1. `app` - La aplicación web principal, construida con [Wasp](https://wasp.sh).
2. `e2e-tests` - Tests [Playwright](https://playwright.dev/) para la aplicación web.
3. `blog` - Blog y documentación, construido con [Astro](https://docs.astro.build) basado en [Starlight](https://starlight.astro.build/).

## Características Principales

- **Dashboard de Métricas**: KPIs, gráficos y análisis de rendimiento
- **Gestión de Partidos**: Reservas, calendario de pistas, estados de partidos
- **Sistema de Comunicación**: Chats en tiempo real y notificaciones
- **Página Pública**: Interfaz estilo Playtomic para reservas públicas
- **Facturación**: Generación automática de facturas y reportes
- **Configuración**: Gestión de usuarios, permisos y configuración del club

## Desarrollo

Para obtener instrucciones detalladas de configuración y desarrollo, consulta los READMEs de cada directorio respectivo.

## Tecnologías

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: Wasp Auth (email, Google, GitHub, Discord)
- **Pagos**: Stripe, LemonSqueezy
- **Testing**: Jest, Playwright, Testing Library
