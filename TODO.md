# TODO - PadelClub Manager Pro
## Planificación Restructurada con Tareas Pequeñas y Comprensibles

> **ENFOQUE**: Tareas de 2-8 horas, incrementales, con valor visible inmediato. Pagos dejados al final según solicitud.

---

## ✅ COMPLETADO

### FASE 0: Configuración Inicial
- [x] **[2025-07-18]** Crear repositorio GitHub - **Dificultad: FÁCIL** ✅ COMPLETADO
- [x] **[2025-07-18]** Inicializar proyecto con Open SaaS (Wasp) - **Dificultad: MEDIO** ✅ COMPLETADO
- [x] **[2025-07-18]** Personalizar layout principal del dashboard - **Dificultad: MEDIO** ✅ COMPLETADO
- [x] **[2025-07-18]** Reorganizar TODO.md con tareas pequeñas y comprensibles - **Dificultad: FÁCIL** ✅ COMPLETADO

---

## 🚧 PRÓXIMAS TAREAS

### **FASE 1: Fundamentos de Pádel (Semana 1-2)**
**Objetivo**: Crear la base de datos y modelos específicos del negocio de pádel

#### 1.1 Modelos de Base de Datos

- [x] **[2025-07-18]** Crear modelo Club - **Dificultad: FÁCIL** ✅ COMPLETADO
  - Descripción: Modelo principal para clubs multi-tenant
  - Campos: name, address, phone, email, settings, timezone, slug
  - Relación 1:N con User (administradores del club)
  - Archivos: schema.prisma, migraciones
  - Tiempo estimado: 2-3 horas
  - Dependencias: Base OpenSaaS configurada

- [x] **[2025-07-18]** Crear modelo Court (Pista) - **Dificultad: FÁCIL** ✅ COMPLETADO
  - Descripción: Modelo para pistas de pádel
  - Campos: name, type (indoor/outdoor), status (active/maintenance), pricePerHour
  - Relación N:1 con Club
  - Configuración de horarios de operación
  - Archivos: schema.prisma
  - Tiempo estimado: 2-3 horas
  - Dependencias: Modelo Club creado

- [x] **[2025-07-18]** Crear modelo Booking (Reserva) - **Dificultad: MEDIO** ✅ COMPLETADO
  - Descripción: Modelo central de reservas de pistas
  - Campos: date, startTime, endTime, status, totalPrice, customerName, customerPhone
  - Relaciones: Club, Court, User (quien hizo la reserva)
  - Estados: pending, confirmed, cancelled, completed
  - Archivos: schema.prisma
  - Tiempo estimado: 3-4 horas
  - Dependencias: Modelos Club y Court

#### 1.2 Operaciones Básicas (CRUD)

- [x] **[2025-07-18]** Crear operaciones CRUD para Club - **Dificultad: FÁCIL** ✅ COMPLETADO
  - Descripción: Operaciones básicas de gestión de clubs
  - Funciones: createClub, getClub, updateClub
  - Validaciones con Zod para datos del club
  - Queries y Actions en main.wasp
  - Archivos: src/club/operations.ts, main.wasp
  - Tiempo estimado: 2-3 horas
  - Dependencias: Modelo Club en BD

- [x] **[2025-07-18]** Crear operaciones CRUD para Court - **Dificultad: FÁCIL** ✅ COMPLETADO
  - Descripción: Gestión completa de pistas
  - Funciones: createCourt, getCourts, updateCourt, deleteCourt
  - Filtros por club (multi-tenant)
  - Validaciones de horarios y precios
  - Archivos: src/courts/operations.ts, main.wasp
  - Tiempo estimado: 2-3 horas
  - Dependencias: Modelo Court, operaciones Club

### **FASE 2: Dashboard de Gestión de Pistas (Semana 3)**
**Objetivo**: Permitir a los administradores gestionar sus pistas

#### 2.1 Lista de Pistas

- [x] **[2025-07-18]** Crear página de gestión de pistas - **Dificultad: FÁCIL** ✅ COMPLETADO
  - Descripción: Interfaz principal para ver y gestionar pistas
  - Componentes: Tabla responsiva con lista de pistas del club
  - Funcionalidades: Botones crear/editar/eliminar, estados visuales
  - Estados visuales: activa (verde), mantenimiento (rojo), inactiva (gris)
  - Archivos: src/courts/CourtsPage.tsx, main.wasp (ruta)
  - Tiempo estimado: 3-4 horas
  - Dependencias: Operaciones CRUD de Court

- [ ] **[DESPUÉS]** Formulario crear/editar pista - **Dificultad: MEDIO**
  - Descripción: Modal o página para gestionar datos de pista
  - Componentes: Formulario con validación en tiempo real
  - Campos: nombre, tipo, estado, precio, horarios básicos
  - Upload de imagen de pista (opcional, usando sistema S3 de OpenSaaS)
  - Archivos: src/courts/components/CourtForm.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: Página de gestión de pistas

#### 2.2 Configuración Básica

- [ ] **[DESPUÉS]** Configuración de horarios por pista - **Dificultad: MEDIO**
  - Descripción: Sistema de configuración de disponibilidad
  - Funcionalidades: Horario apertura/cierre, días activos, precios por franja
  - Componentes: Selector de horarios visual, configuración de precios
  - Validaciones: Horarios lógicos, precios positivos
  - Archivos: src/courts/components/CourtSchedule.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: Formulario de pista completado

### **FASE 3: Sistema de Reservas Básico (Semana 4)**
**Objetivo**: Funcionalidad core de reservas para el personal del club

#### 3.1 Vista de Calendario Simple

- [ ] **[DESPUÉS]** Calendario diario básico - **Dificultad: MEDIO**
  - Descripción: Vista de cuadrícula para reservas del día
  - Layout: Grid simple con pistas (filas) x horarios (columnas) en intervalos de 30min
  - Estados visuales: libre (blanco), ocupado (verde), mantenimiento (rojo)
  - Solo vista de lectura por ahora, sin drag&drop
  - Archivos: src/bookings/components/DailyCalendar.tsx
  - Tiempo estimado: 5-6 horas
  - Dependencias: Modelos Booking y Court listos

- [ ] **[DESPUÉS]** Crear reserva manual - **Dificultad: MEDIO**
  - Descripción: Modal para crear nueva reserva desde el staff
  - Componentes: Modal con selección de pista, hora, duración
  - Datos: Información básica del cliente (nombre, teléfono)
  - Validaciones: Disponibilidad en tiempo real, datos requeridos
  - Archivos: src/bookings/components/CreateBookingModal.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: Calendario diario básico

#### 3.2 Gestión de Reservas

- [ ] **[DESPUÉS]** Lista de reservas del día - **Dificultad: FÁCIL**
  - Descripción: Tabla con todas las reservas del día seleccionado
  - Componentes: Tabla responsiva ordenada por hora
  - Filtros: fecha, pista, estado de la reserva
  - Acciones: ver detalles, editar, cancelar reserva
  - Archivos: src/bookings/BookingsListPage.tsx
  - Tiempo estimado: 3-4 horas
  - Dependencias: Sistema de creación de reservas

- [ ] **[DESPUÉS]** Detalles de reserva - **Dificultad: FÁCIL**
  - Descripción: Modal con información completa de una reserva
  - Componentes: Vista detallada con todos los datos
  - Funcionalidades: Edición básica (hora, duración), cambio de estado
  - Estados: confirmar, cancelar, marcar como completada
  - Archivos: src/bookings/components/BookingDetailsModal.tsx
  - Tiempo estimado: 2-3 horas
  - Dependencias: Lista de reservas funcionando

### **FASE 4: Mejoras del Dashboard (Semana 5)**
**Objetivo**: Dashboard con métricas reales del negocio de pádel

#### 4.1 Métricas Específicas

- [ ] **[DESPUÉS]** KPIs de ocupación - **Dificultad: MEDIO**
  - Descripción: Métricas clave del negocio del club
  - Métricas: % ocupación por pista/día, horas pico vs valle, ingresos por pista
  - Componentes: Cards de estadísticas actualizados con datos reales
  - Cálculos: Agregaciones por día/semana/mes
  - Archivos: src/dashboard/components/PadelMetrics.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: Sistema de reservas con datos

- [ ] **[DESPUÉS]** Gráficos de actividad - **Dificultad: MEDIO**
  - Descripción: Visualización de tendencias y patrones
  - Gráficos: Barras (reservas por día), circular (distribución por pista)
  - Tendencias: Comparativas semanales y mensuales
  - Integración: Usar sistema de charts de OpenSaaS
  - Archivos: src/dashboard/components/ActivityCharts.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: KPIs de ocupación implementados

#### 4.2 Acciones Rápidas Específicas

- [ ] **[DESPUÉS]** Panel de acciones rápidas - **Dificultad: FÁCIL**
  - Descripción: Shortcuts a funciones principales del club
  - Acciones: "Nueva reserva", "Ver calendario", "Configurar pistas"
  - Accesos: "Reservas de hoy", "Programa mantenimiento"
  - Enlaces directos a las páginas principales de gestión
  - Archivos: src/dashboard/components/QuickActions.tsx (actualizar)
  - Tiempo estimado: 2-3 horas
  - Dependencias: Páginas principales de gestión creadas

### **FASE 5: Funcionalidades Avanzadas de Reservas (Semana 6-7)**
**Objetivo**: Sistema completo de gestión de reservas

#### 5.1 Calendario Avanzado

- [ ] **[DESPUÉS]** Implementar drag & drop - **Dificultad: DIFÍCIL**
  - Descripción: Capacidad de mover reservas arrastrando en el calendario
  - Funcionalidades: Mover entre horarios/pistas, redimensionar duración
  - Validaciones: Disponibilidad en tiempo real, conflictos
  - Feedback: Indicadores visuales durante el arrastre
  - Archivos: src/bookings/components/DragDropCalendar.tsx
  - Tiempo estimado: 6-8 horas
  - Dependencias: Calendario básico funcionando

- [ ] **[DESPUÉS]** Vista semanal del calendario - **Dificultad: MEDIO**
  - Descripción: Extensión para ver una semana completa
  - Navegación: Botones anterior/siguiente semana
  - Vista: Compacta mostrando ocupación por día
  - Resumen: Estadísticas de ocupación de la semana
  - Archivos: src/bookings/components/WeeklyCalendar.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: Drag & drop implementado

#### 5.2 Gestión de Clientes

- [ ] **[DESPUÉS]** Modelo y CRUD de clientes - **Dificultad: MEDIO**
  - Descripción: Sistema de gestión de clientes del club
  - Modelo: Customer con name, phone, email, notes, historial
  - Operaciones: CRUD completo, búsqueda rápida
  - Relaciones: Vinculación con reservas históricas
  - Archivos: schema.prisma, src/customers/operations.ts
  - Tiempo estimado: 4-5 horas
  - Dependencias: Sistema de reservas estable

- [ ] **[DESPUÉS]** Reservas recurrentes - **Dificultad: DIFÍCIL**
  - Descripción: Sistema para clientes con reservas fijas
  - Patrones: Repetición semanal, quincenal, mensual
  - Gestión: Crear serie, manejar excepciones, cancelación en lote
  - Validaciones: Disponibilidad para toda la serie
  - Archivos: src/bookings/components/RecurringBookings.tsx
  - Tiempo estimado: 6-8 horas
  - Dependencias: Sistema de clientes funcionando

### **FASE 6: Página Pública Simple (Semana 8)**
**Objetivo**: Página básica para que los jugadores vean disponibilidad

#### 6.1 Vista Pública de Disponibilidad

- [ ] **[DESPUÉS]** Página pública básica - **Dificultad: MEDIO**
  - Descripción: Interfaz pública para visualizar disponibilidad
  - URL: /club/[slug] (usando slug único del club)
  - Funcionalidad: Vista de disponibilidad sin requerir login
  - Limitaciones: Solo lectura, no permite hacer reservas aún
  - Archivos: src/public/ClubPublicPage.tsx, main.wasp (ruta pública)
  - Tiempo estimado: 4-5 horas
  - Dependencias: Sistema de reservas y clubs funcionando

- [ ] **[DESPUÉS]** Información del club - **Dificultad: FÁCIL**
  - Descripción: Página informativa del club
  - Información: Datos básicos (dirección, teléfono, horarios)
  - Extras: Galería de fotos (opcional), mapa de ubicación
  - Diseño: Responsive, profesional, usando components de OpenSaaS
  - Archivos: src/public/components/ClubInfo.tsx
  - Tiempo estimado: 2-3 horas
  - Dependencias: Página pública básica

### **FASE 7: Sistema de Notificaciones (Semana 9)**
**Objetivo**: Comunicación básica con clientes

#### 7.1 Notificaciones Básicas

- [ ] **[DESPUÉS]** Email de confirmación - **Dificultad: MEDIO**
  - Descripción: Email automático cuando se confirma una reserva
  - Template: Email HTML con datos de la reserva
  - Integración: Sistema de email de Wasp/OpenSaaS
  - Contenido: Detalles completos, información del club
  - Archivos: src/emails/templates/BookingConfirmation.tsx
  - Tiempo estimado: 3-4 horas
  - Dependencias: Sistema de reservas operativo

- [ ] **[DESPUÉS]** Recordatorios automáticos - **Dificultad: MEDIO**
  - Descripción: Job programado para recordatorios de reservas
  - Timing: 24 horas antes de la reserva
  - Contenido: Email simple con detalles de la reserva
  - Sistema: Job scheduler de Wasp para automatización
  - Archivos: src/jobs/bookingReminders.ts, main.wasp (job)
  - Tiempo estimado: 4-5 horas
  - Dependencias: Sistema de emails funcionando

### **FASE 8: Configuración y Ajustes (Semana 10)**
**Objetivo**: Panel de configuración para personalizar el club

#### 8.1 Configuración del Club

- [ ] **[DESPUÉS]** Página de configuración - **Dificultad: FÁCIL**
  - Descripción: Panel central de configuración del club
  - Configuración: Datos básicos, horarios generales, políticas de cancelación
  - Interfaz: Formularios organizados por secciones
  - Validaciones: Datos requeridos, formatos correctos
  - Archivos: src/settings/ClubSettingsPage.tsx
  - Tiempo estimado: 3-4 horas
  - Dependencias: Modelo Club completo

- [ ] **[DESPUÉS]** Gestión de usuarios del club - **Dificultad: MEDIO**
  - Descripción: Sistema de roles y permisos para el club
  - Roles: admin (propietario), staff (empleado)
  - Funcionalidades: Invitar staff por email, asignar permisos
  - Permisos: Crear/editar/cancelar reservas, configurar pistas
  - Archivos: src/settings/UserManagement.tsx
  - Tiempo estimado: 4-5 horas
  - Dependencias: Sistema de configuración base

### **FASE 9: Testing y Pulido (Semana 11)**
**Objetivo**: Asegurar calidad y estabilidad

#### 9.1 Testing

- [ ] **[DESPUÉS]** Tests unitarios core - **Dificultad: MEDIO**
  - Descripción: Tests para funcionalidades críticas
  - Cobertura: Operaciones CRUD, lógica de reservas, validaciones
  - Framework: Jest integrado en OpenSaaS
  - Casos: Validaciones de negocio, edge cases
  - Archivos: src/__tests__/ (varios archivos)
  - Tiempo estimado: 6-8 horas
  - Dependencias: Funcionalidades core estables

- [ ] **[DESPUÉS]** Tests E2E principales - **Dificultad: MEDIO**
  - Descripción: Tests de flujos completos de usuario
  - Flujos: Reserva completa, gestión de pistas, login/navegación
  - Framework: Playwright ya configurado en OpenSaaS
  - Escenarios: Happy path y casos de error
  - Archivos: e2e-tests/padelClub.spec.ts
  - Tiempo estimado: 4-6 horas
  - Dependencias: MVP funcional completo

### **FASE 10: Integración de Pagos (Semana 12 - FINAL)**
**Objetivo**: Monetización y facturación (dejado al final según solicitud)

#### 10.1 Pagos de Reservas

- [ ] **[DESPUÉS]** Integrar Stripe para reservas - **Dificultad: DIFÍCIL**
  - Descripción: Sistema de pagos para reservas públicas
  - Funcionalidades: Checkout online, webhooks para confirmación
  - Flujo: Cliente paga → reserva se confirma automáticamente
  - Reembolsos: Sistema para cancelaciones con política del club
  - Archivos: src/payments/bookingPayments.ts
  - Tiempo estimado: 8-10 horas
  - Dependencias: Página pública y Stripe de OpenSaaS

#### 10.2 Facturación del Club

- [ ] **[DESPUÉS]** Sistema de suscripción del club - **Dificultad: MEDIO**
  - Descripción: Monetización de la plataforma (SaaS)
  - Planes: básico (1-3 pistas), pro (4-8 pistas), premium (ilimitado)
  - Límites: Número de pistas, reservas mensuales, usuarios
  - Panel: Interfaz de facturación para propietarios de club
  - Archivos: src/subscriptions/ClubSubscription.tsx
  - Tiempo estimado: 6-8 horas
  - Dependencias: Sistema de pagos base de OpenSaaS

---

## 📊 ESTIMACIÓN REVISADA

### Por Fases
1. **Fundamentos (1-2)**: 14-18 horas  
2. **Gestión Pistas (3)**: 9-14 horas  
3. **Reservas Básico (4)**: 14-18 horas  
4. **Mejoras Dashboard (5)**: 10-13 horas  
5. **Reservas Avanzado (6-7)**: 18-26 horas  
6. **Página Pública (8)**: 6-8 horas  
7. **Notificaciones (9)**: 7-9 horas  
8. **Configuración (10)**: 7-9 horas  
9. **Testing (11)**: 10-14 horas  
10. **Pagos (12)**: 14-18 horas  

### Totales
- **MVP sin pagos (Fases 1-9)**: ~105-129 horas
- **Con pagos (Fase 10)**: ~119-147 horas
- **Duración total**: 12 semanas con tareas manejables

## 🎯 BENEFICIOS DE ESTA REORGANIZACIÓN

1. **✅ Tareas pequeñas**: 2-8 horas cada una (vs 15-25 horas originales)
2. **✅ Progreso incremental**: Cada tarea entrega valor visible
3. **✅ Dependencias claras**: Orden lógico de implementación  
4. **✅ Verificable**: Criterios de aceptación específicos
5. **✅ Pagos al final**: Toda la monetización en la última fase
6. **✅ Enfoque en el core**: Primero funcionalidades esenciales del negocio

---

**Última actualización**: 2025-07-18 - Reorganización completa con tareas pequeñas y comprensibles