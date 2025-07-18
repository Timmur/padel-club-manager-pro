# Arquitectura de Padel Club Manager Pro

## Resumen

Padel Club Manager Pro es un sistema SaaS integral para la gestión de clubes de pádel, basado en [OpenSaaS](https://opensaas.sh) y [Wasp](https://wasp.sh). Proporciona una solución completa que incluye gestión de reservas, comunicación en tiempo real, facturación, y una interfaz pública para los jugadores.

## Stack Tecnológico

### Frontend
- **React 18** - Framework principal del frontend
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de CSS para estilos
- **TypeScript** - Tipado estático

### Backend
- **Node.js** - Runtime del servidor
- **Express** - Framework web para APIs
- **Prisma ORM** - Gestión de base de datos
- **Wasp** - Framework full-stack

### Base de Datos
- **PostgreSQL** - Base de datos principal
- **Docker** - Contenedores para desarrollo

### Autenticación
- **Wasp Auth** - Sistema de autenticación integrado
- **Email/Password** - Autenticación principal
- **Google/GitHub/Discord** - Autenticación social (opcional)

### Pagos
- **Stripe** - Procesamiento de pagos principal
- **LemonSqueezy** - Procesamiento de pagos alternativo

### Testing
- **Jest** - Tests unitarios
- **Playwright** - Tests e2e
- **Testing Library** - Tests de componentes

## Arquitectura del Sistema

### Estructura de Directorios

```
padel-club-manager-pro/
├── app/                    # Aplicación principal Wasp
│   ├── src/
│   │   ├── client/        # Código del frontend
│   │   ├── server/        # Código del backend
│   │   └── shared/        # Código compartido
│   ├── main.wasp          # Configuración principal
│   └── schema.prisma      # Esquema de base de datos
├── e2e-tests/             # Tests de extremo a extremo
├── blog/                  # Blog y documentación
└── docs/                  # Documentación técnica
```

### Entidades Principales

#### User
- Sistema de usuarios con roles (admin, staff, cliente)
- Integración con autenticación social
- Perfiles de jugadores

#### Club
- Información del club (multi-tenant)
- Configuración y personalización
- Horarios y tarifas

#### Court (Pista)
- Gestión de pistas de pádel
- Disponibilidad y mantenimiento
- Configuración por pista

#### Booking (Reserva)
- Reservas de pistas
- Estados: pendiente, confirmado, cancelado
- Integración con pagos

#### Match (Partido)
- Partidos organizados
- Gestión de jugadores
- Resultados y estadísticas

#### Payment
- Procesamiento de pagos
- Facturación automática
- Integración con Stripe/LemonSqueezy

### Módulos del Sistema

#### 1. Dashboard de Métricas
- **Ubicación**: `src/client/dashboard/`
- **Funcionalidad**: KPIs, gráficos, análisis
- **Tecnologías**: React Charts, Recharts

#### 2. Gestión de Partidos
- **Ubicación**: `src/client/matches/`
- **Funcionalidad**: CRUD de partidos, reservas
- **Tecnologías**: React Hook Form, React Query

#### 3. Calendario de Pistas
- **Ubicación**: `src/client/calendar/`
- **Funcionalidad**: Vista de calendario, drag & drop
- **Tecnologías**: React Calendar, React DnD

#### 4. Sistema de Comunicación
- **Ubicación**: `src/client/chat/`
- **Funcionalidad**: Chat en tiempo real, notificaciones
- **Tecnologías**: WebSockets, Socket.io

#### 5. Página Pública
- **Ubicación**: `src/client/public/`
- **Funcionalidad**: Interfaz pública estilo Playtomic
- **Tecnologías**: React Router, SEO optimizado

#### 6. Facturación
- **Ubicación**: `src/client/billing/`
- **Funcionalidad**: Generación de facturas, reportes
- **Tecnologías**: PDF generation, Stripe integration

### APIs y Servicios

#### Operaciones Wasp
- **Queries**: Obtener datos (solo lectura)
- **Actions**: Modificar datos (escritura)
- **Jobs**: Tareas en segundo plano

#### Endpoints REST
- **Públicos**: `/api/public/*` - Sin autenticación
- **Privados**: `/api/private/*` - Con autenticación
- **Webhooks**: `/api/webhooks/*` - Para integraciones

### Patrones de Diseño

#### Domain-Driven Design (DDD)
- Separación por dominios de negocio
- Entidades y servicios específicos del dominio
- Repositorios para acceso a datos

#### Repository Pattern
- Abstracción de acceso a datos
- Fácil testeo y mantenimiento
- Separación de la lógica de negocio

#### Service Layer
- Lógica de negocio centralizada
- Reutilización de código
- Validaciones y reglas de negocio

## Puntos de Extensión para Desarrolladores

### 1. Nuevas Entidades
Para agregar nuevas entidades al sistema:

```typescript
// En schema.prisma
model NewEntity {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// En main.wasp
entity NewEntity {=psl
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
psl=}
```

### 2. Nuevas Páginas
Para agregar nuevas páginas:

```typescript
// En main.wasp
route NewPageRoute { path: "/new-page", to: NewPage }
page NewPage {
  component: import { NewPage } from "@src/client/pages/NewPage",
  authRequired: true
}
```

### 3. Nuevas Operaciones
Para agregar nuevas queries o actions:

```typescript
// En main.wasp
query getNewData {
  fn: import { getNewData } from "@src/server/queries",
  entities: [NewEntity]
}

action createNewEntity {
  fn: import { createNewEntity } from "@src/server/actions",
  entities: [NewEntity]
}
```

### 4. Middleware Personalizado
Para agregar middleware:

```typescript
// En main.wasp
app PadelClubManagerPro {
  server: {
    middlewareConfigFn: import { serverMiddlewareFn } from "@src/server/serverSetup"
  }
}
```

## Configuración de Desarrollo

### Variables de Entorno

#### `.env.server`
```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/padel_club_db"

# Autenticación
WASP_WEB_CLIENT_URL="http://localhost:3000"
WASP_SERVER_URL="http://localhost:3001"

# Email
SENDGRID_API_KEY="your_sendgrid_api_key"

# Pagos
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Analytics
PLAUSIBLE_API_KEY="your_plausible_api_key"
```

#### `.env.client`
```env
# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
REACT_APP_PLAUSIBLE_SITE_ID="padel-club-manager.com"
```

### Comandos de Desarrollo

```bash
# Iniciar base de datos
wasp start db

# Aplicar migraciones
wasp db migrate-dev

# Iniciar aplicación
wasp start

# Ejecutar tests
wasp test

# Generar cliente de base de datos
wasp db generate
```

## Deployment

### Producción con Fly.io
```bash
# Deploy completo
wasp deploy

# Solo servidor
wasp deploy fly deploy --context server

# Solo cliente
wasp deploy fly deploy --context client
```

### Variables de Entorno de Producción
```bash
# Configurar variables en Fly.io
flyctl secrets set DATABASE_URL="postgresql://..."
flyctl secrets set STRIPE_SECRET_KEY="sk_live_..."
```

## Consideraciones de Seguridad

1. **Autenticación**: Todas las rutas administrativas requieren autenticación
2. **Autorización**: Roles y permisos por tipo de usuario
3. **Validación**: Validación en cliente y servidor
4. **Sanitización**: Limpieza de datos de entrada
5. **HTTPS**: Forzar HTTPS en producción
6. **Secretos**: Variables de entorno para datos sensibles

## Monitoreo y Observabilidad

1. **Logs**: Logging estructurado con Winston
2. **Métricas**: Plausible Analytics para frontend
3. **Errores**: Sentry para tracking de errores
4. **Performance**: Métricas de rendimiento de base de datos
5. **Uptime**: Monitoreo de disponibilidad

## Roadmap de Extensión

### Fase 1: MVP
- ✅ Configuración base
- ⏳ Dashboard de métricas
- ⏳ Gestión de partidos
- ⏳ Sistema de comunicación

### Fase 2: Funcionalidades Avanzadas
- ⏳ Página pública
- ⏳ Facturación
- ⏳ Configuración avanzada

### Fase 3: Mejoras Futuras
- ⏳ Gestión de clases
- ⏳ Sistema de ligas
- ⏳ Gestión de torneos
- ⏳ App móvil nativa

## Soporte y Contribución

Para contribuir al proyecto:

1. Clona el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Agrega tests
5. Crea un Pull Request

Para soporte técnico, consulta la documentación de [OpenSaaS](https://docs.opensaas.sh) y [Wasp](https://wasp.sh/docs).
