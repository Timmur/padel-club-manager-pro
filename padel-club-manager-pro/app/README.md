# Padel Club Manager Pro

Construido con [Wasp](https://wasp.sh), basado en el template [Open Saas](https://opensaas.sh).

## Desarrollo

### Ejecutar localmente
 - Asegúrate de tener los archivos `.env.client` y `.env.server` con los valores correctos de desarrollo en la raíz del proyecto.
 - Ejecuta la base de datos con `wasp start db` y déjala corriendo.
 - Ejecuta `wasp start` y déjalo corriendo.
 - [OPCIONAL]: Si es la primera vez que inicias la aplicación, o acabas de hacer cambios en tus entidades/esquema de prisma, también ejecuta `wasp db migrate-dev`.

### Arquitectura del Proyecto

Este proyecto sigue la arquitectura de [OpenSaaS](https://opensaas.sh) con las siguientes personalizaciones para gestión de clubes de pádel:

- **Autenticación**: Sistema completo de login/registro con verificación por email
- **Dashboard**: Métricas y KPIs específicos para clubes de pádel
- **Gestión de Partidos**: Sistema de reservas y calendario de pistas
- **Comunicación**: Chat en tiempo real y notificaciones
- **Página Pública**: Interfaz para reservas públicas estilo Playtomic
- **Facturación**: Integración con Stripe/LemonSqueezy para pagos

### Puertos de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Base de Datos**: PostgreSQL (Docker)

