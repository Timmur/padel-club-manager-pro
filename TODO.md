# TODO - SaaS Pádel 1.0

## Planificación de Desarrollo - PadelClub Manager (Base Open SaaS)

> **NOTA:** Este proyecto parte de la base Open SaaS (Wasp, React, Node.js, Prisma, Stripe, LemonSqueezy, autenticación integrada, Docker, testing, arquitectura multi-tenant, etc.). Todas las tareas deben enfocarse en personalización, lógica de negocio, experiencia de usuario, dominio pádel y documentación. No repetir tareas ya resueltas por Open SaaS.

### FASE 0: Configuración Inicial (Completado)

- [x] **[2025-07-18]** Crear repositorio GitHub - **Dificultad: FÁCIL**
  - Configurar repositorio padel-club-manager-pro
  - Crear README.md profesional
  - Configurar .gitignore
  - Subir documentación inicial (PRD, PRP, TODO)
  - Archivos: README.md, .gitignore, documentación completa
  - Tiempo estimado: 2 horas
  - Dependencias: Ninguna

- [x] **[2025-07-18]** Limpiar configuración de puertos (usar solo 3000-3001) - **Dificultad: FÁCIL**
  - Eliminado proceso ejecutándose en puerto 3002
  - Verificado que no hay configuraciones de puerto 3002 en archivos del proyecto
  - Confirmado uso exclusivo de puertos 3000 y 3001 para desarrollo
  - Archivos: Configuración del sistema
  - Tiempo estimado: 1 hora
  - Dependencias: Ninguna

- [x] **[2025-07-18]** Resolver problema de verificación de email - **Dificultad: MEDIO**
  - Configurado proveedor de email SendGrid para producción
  - Creado script de verificación manual para desarrollo (verificar-email-script.js)
  - Creado script SQL para verificación directa en base de datos
  - Configurado email del sistema: no-reply@padelclub-manager.com
  - Documentado proceso completo en CONFIGURACION-EMAIL.md
  - Usuario timsa001@gmail.com listo para verificación manual
  - Archivos: main.wasp, verificar-email-script.js, verificar-email-manual.sql, CONFIGURACION-EMAIL.md
  - Tiempo estimado: 3 horas
  - Dependencias: Ninguna

### FASE 1: Personalización de la Base Open SaaS (Semana 1-2)

- [x] **[2025-07-18]** Inicializar proyecto con Open SaaS (Wasp) - **Completado**
  - No repetir: autenticación, pagos, base de datos, estructura, Docker, testing, CI/CD, multi-tenant, Stripe, LemonSqueezy, NextAuth, etc. (ya incluidos)
  - Personalizar branding, nombre, metadatos y estructura de carpetas según pádel
  - Documentar arquitectura y puntos de extensión para desarrolladores y agentes AI
  - Archivos: main.wasp, README, docs/
  - **COMPLETADA**

- [ ] **[2025-07-22]** Personalizar layout principal del dashboard (UI/UX pádel) - **Dificultad: MEDIO**
  - Sidebar y navegación inspirada en Playtomic, pero usando componentes y hooks de Open SaaS
  - Header con usuario, notificaciones y branding del club
  - Routing y estructura de secciones usando el sistema de rutas de Wasp
  - Archivos: components/layout/, app/dashboard/layout.tsx
  - Tiempo estimado: 6-8 horas
  - Dependencias: Base Open SaaS personalizada

### FASE 2: Módulo Métricas (Semana 3)

- [ ] **[2025-07-27]** Implementar dashboard de métricas (aprovechando hooks y entidades Open SaaS) - **Dificultad: DIFÍCIL**
  - KPIs: partidos, ingresos, usuarios, retención (usar modelos y queries de Open SaaS como base)
  - Gráficos y visualizaciones: reutilizar componentes de charts existentes o integrar librerías nuevas
  - Filtros de tiempo y segmentación avanzada
  - Archivos: app/dashboard/metricas/, components/charts/
  - Tiempo estimado: 12-15 horas
  - Dependencias: Layout principal

- [ ] **[2025-07-29]** Integrar analytics y alertas en tiempo real (usando extensiones Open SaaS) - **Dificultad: EXPERTO**
  - Tracking de eventos y métricas clave (usar hooks y jobs de Open SaaS)
  - Alertas automáticas y notificaciones administrativas
  - Archivos: lib/analytics.ts, api/metrics/
  - Tiempo estimado: 10-12 horas
  - Dependencias: Dashboard de métricas

### FASE 3: Gestión de Partidos y Reservas (Semana 4-5)

- [ ] **[2025-08-03]** Crear módulo de gestión de partidos y reservas (extendiendo entidades Open SaaS) - **Dificultad: DIFÍCIL**
  - Lista de partidos con filtros avanzados (aprovechar paginación y queries de Open SaaS)
  - Formularios de reservas online/offline (usar validaciones y lógica de Open SaaS)
  - Estados de partidos: confirmado, pendiente, cancelado, etc.
  - Archivos: app/dashboard/partidos/, domains/bookings/
  - Tiempo estimado: 15-18 horas
  - Dependencias: Métricas implementadas

- [ ] **[2025-08-05]** Implementar Sistema de Calendario de Pistas (sobre Open SaaS) - **Dificultad: MUY-ALTO**
  - Vista de calendario diaria con drag & drop
  - Sistema de estados visuales para reservas
  - Configuración de disponibilidad por pista
  - Archivos: components/calendar/, domains/courts/
  - Tiempo estimado: 12-15 horas
  - Dependencias: Gestión de partidos

## Métricas del Proyecto

### MVP (Fases 1-7)
- **Tiempo estimado total**: 147-173 horas
- **Duración**: 10 semanas (18 de julio - 26 de septiembre 2025)
- **Módulos incluidos**: Métricas, Partidos, Chats, Página Pública Playtomic, Facturación, Configuración

### Tecnologías Principales (heredadas de Open SaaS)
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: Wasp Auth (email, Google, GitHub, Discord)
- **Pagos**: Stripe, LemonSqueezy (integración lista)
- **Real-time**: WebSockets (integrable)
- **Charts**: Recharts, Chart.js o librerías compatibles
- **Testing**: Jest, Playwright, Testing Library (setup base incluido)

---

**Última actualización**: 2025-07-18 (ajustado a base Open SaaS)