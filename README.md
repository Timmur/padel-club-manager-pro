# 🏓 PadelClub Manager

**Plataforma SaaS B2B para gestión integral de clubes de pádel**

> Dashboard administrativo profesional + página pública de reservas moderna

Este proyecto está basado en el template [OpenSaaS](https://opensaas.sh) y utiliza tecnologías modernas para ofrecer una solución completa de gestión de clubes de pádel.

## 🚀 Estado del Proyecto

✅ **Proyecto arrancado exitosamente** - 18 de julio de 2025

- ✅ Base de datos PostgreSQL configurada
- ✅ Aplicación ejecutándose en `http://localhost:3000`
- ✅ Sistema de autenticación implementado
- ✅ Framework Open SaaS configurado
- ✅ Docker y desarrollo local funcionando

## 🏗️ Arquitectura del Proyecto

Este proyecto consta de tres directorios principales:

### 1. `app/` - Aplicación Web Principal
- **Framework**: [Wasp](https://wasp.sh) con Open SaaS template
- **Frontend**: React con Vite
- **Backend**: Node.js con Express
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: Sistema completo (email, Google, GitHub, Discord)
- **Pagos**: Stripe y LemonSqueezy integrados

### 2. `e2e-tests/` - Tests End-to-End
- **Framework**: [Playwright](https://playwright.dev/)
- **Cobertura**: Tests completos para la aplicación web

### 3. `blog/` - Blog y Documentación
- **Framework**: [Astro](https://docs.astro.build)
- **Template**: [Starlight](https://starlight.astro.build/)
- **Uso**: Blog corporativo y documentación técnica

## 📋 Descripción del Proyecto

PadelClub Manager es una plataforma SaaS B2B diseñada específicamente para administradores y propietarios de clubes de pádel que necesitan gestionar eficientemente sus operaciones diarias. La plataforma combina un dashboard administrativo completo con una página pública simple donde los jugadores pueden ver disponibilidad y reservar pistas.

### 🎯 Objetivos del Producto

- **Objetivo Primario**: Reducir el tiempo dedicado a tareas administrativas en un 60% mientras se aumenta la ocupación de pistas en un 25% durante el primer año de uso.
- **Objetivos Secundarios**: Mejorar la satisfacción del personal del club mediante herramientas intuitivas, aumentar la retención de miembros a través de mejor comunicación, y proporcionar visibilidad completa sobre el rendimiento del negocio.

## 🔧 Características Principales

### Para Clubes (B2B)
- **Dashboard Administrativo**: Gestión completa de reservas, pistas, jugadores y finanzas
- **Gestión de Miembros**: Control de membresías, pagos y comunicación
- **Reportes y Analytics**: Métricas de ocupación, ingresos y rendimiento
- **Automatización**: Procesos automatizados para reducir trabajo manual

### Para Jugadores (B2C)
- **Página Pública**: Interfaz simple para ver disponibilidad de pistas
- **Sistema de Reservas**: Reserva fácil y rápida sin necesidad de registro complejo
- **Notificaciones**: Confirmaciones y recordatorios automáticos

## 🚀 Desarrollo Local

### Prerrequisitos
- Node.js 18+
- Docker Desktop
- WSL2 (para Windows)
- Wasp CLI instalado

### Configuración inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/Timmur/padel-club-manager-pro.git
cd padel-club-manager-pro

# 2. Navegar al directorio de la aplicación
cd app

# 3. Configurar variables de entorno
cp .env.server.example .env.server
cp .env.client.example .env.client

# 4. Iniciar la base de datos (en una terminal separada)
wasp db start

# 5. Aplicar migraciones
wasp db migrate-dev

# 6. Iniciar la aplicación
wasp start
```

La aplicación estará disponible en `http://localhost:3000`

### Comandos útiles

```bash
# Iniciar base de datos
wasp db start

# Aplicar migraciones
wasp db migrate-dev

# Iniciar aplicación
wasp start

# Acceder a Prisma Studio
wasp db studio

# Ejecutar tests
cd ../e2e-tests
npm test

# Iniciar blog/docs
cd ../blog
npm install
npm run dev
```

## 💼 Modelo de Negocio

**Clientes que Pagan**: Clubes de pádel (€49-199/mes según plan)  
**Usuarios Directos**: Administradores, gerentes, recepcionistas del club  
**Usuarios Indirectos**: Jugadores (acceso gratuito a página pública)  
**Fuente de Ingresos**: Suscripciones mensuales de clubes únicamente

## 🎨 Diferenciadores Clave

- ✅ **Especialización completa en pádel** con funcionalidades específicas del deporte
- ✅ **Enfoque exclusivo en la experiencia del administrador** del club
- ✅ **Arquitectura multi-tenant escalable**
- ✅ **Integración nativa** con herramientas de pago y comunicación

## 📊 Mercado Objetivo

- **TAM**: ~15,000 clubes de pádel en Europa
- **SAM**: ~8,000 clubes medianos (4-12 pistas)
- **Expansión**: Potencial de 25,000 clubes en los próximos 5 años

## 📁 Estructura del Proyecto

```
padel-club-manager-pro/
├── app/                                      # Aplicación principal Wasp
│   ├── main.wasp                            # Configuración principal
│   ├── src/                                 # Código fuente
│   │   ├── client/                          # Frontend React
│   │   ├── server/                          # Backend Node.js
│   │   ├── shared/                          # Código compartido
│   │   └── ...
│   ├── public/                              # Assets públicos
│   ├── schema.prisma                        # Schema de base de datos
│   └── .env.server                          # Variables de entorno
├── blog/                                    # Blog y documentación
├── e2e-tests/                               # Tests end-to-end
├── PRD - Product Requirements Document.md    # Especificaciones completas
├── PRP - Product Requirements Proposal.md   # Propuesta inicial
├── TODO.md                                  # Lista de tareas y seguimiento
├── CLAUDE.md                                # Documentación de desarrollo
├── SETUP.md                                 # Configuración inicial
└── Imagenes/                                # Mockups y referencias visuales
```

## 🔗 Enlaces y Recursos

- **Repositorio**: https://github.com/Timmur/padel-club-manager-pro
- **Documentación técnica**: Ver archivos PRD y PRP
- **Open SaaS**: https://opensaas.sh
- **Wasp Framework**: https://wasp.sh

## 📚 Documentación Adicional

- **[PRD - Product Requirements Document](./PRD%20-%20Product%20Requirements%20Document.md)**: Especificaciones técnicas completas
- **[PRP - Product Requirements Proposal](./PRP%20-%20Product%20Requirements%20Proposal.md)**: Propuesta inicial y modelo de negocio
- **[TODO.md](./TODO.md)**: Lista de tareas y seguimiento del proyecto
- **[CLAUDE.md](./CLAUDE.md)**: Documentación de desarrollo con IA
- **[SETUP.md](./SETUP.md)**: Configuración inicial del proyecto

## 🤝 Contribuciones

Este proyecto está en desarrollo activo. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la comunidad de pádel**

**Versión**: 1.0.0  
**Estado**: En desarrollo activo  
**Fecha**: Julio 2025  
**Autor**: Timur

Para más detalles sobre cada directorio, revisa los READMEs específicos de cada uno!