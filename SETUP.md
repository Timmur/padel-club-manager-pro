# 📋 SETUP.md - Guía de Instalación y Configuración
## PadelClub Manager - Proyecto Open SaaS

**Fecha**: 18 de Julio, 2025  
**Estado**: ✅ **FUNCIONANDO** - http://localhost:3000

---

## 🚀 Guía de Instalación Rápida

### Prerrequisitos

- ✅ **Windows 11** con WSL2 activado
- ✅ **Docker Desktop** instalado y funcionando
- ✅ **Node.js 18+** (se maneja via Wasp)
- ✅ **Git** para control de versiones

### Instalación Paso a Paso

#### 1. Instalar Wasp CLI

```bash
# Instalar Wasp en WSL2
wsl bash -c "curl -sSL https://get.wasp.sh/installer.sh | sh"

# Verificar instalación
wsl /home/timur/.local/bin/wasp version
# Output: 0.17.0
```

#### 2. Configurar el Proyecto

```bash
# Navegar al directorio del proyecto
cd c:\Users\timur\Documents\Proyectos\PCM\app

# Crear archivos de entorno
Copy-Item .env.server.example .env.server
Copy-Item .env.client.example .env.client
```

#### 3. Iniciar Base de Datos

```bash
# Iniciar PostgreSQL con Docker (mantener corriendo)
wsl bash -c 'cd /mnt/c/Users/timur/Documents/Proyectos/PCM/app && /home/timur/.local/bin/wasp db start'

# Aplicar migraciones
wsl bash -c 'cd /mnt/c/Users/timur/Documents/Proyectos/PCM/app && /home/timur/.local/bin/wasp db migrate-dev'
```

#### 4. Iniciar Aplicación

```bash
# Iniciar servidor y cliente
wsl bash -c 'cd /mnt/c/Users/timur/Documents/Proyectos/PCM/app && /home/timur/.local/bin/wasp start'
```

#### 5. Verificar Funcionamiento

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Base de datos**: postgresql://localhost:5432/PadelClubManager-f8d4b28a6d

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
padel-club-manager-pro/
├── app/                          # 🎯 Aplicación principal
│   ├── main.wasp                # Configuración de Wasp
│   ├── src/
│   │   ├── client/              # React frontend
│   │   ├── server/              # Node.js backend
│   │   └── shared/              # Código compartido
│   ├── public/                  # Assets estáticos
│   ├── .env.server              # Variables servidor
│   └── .env.client              # Variables cliente
├── blog/                        # Blog con Starlight
├── e2e-tests/                   # Tests E2E
└── documentation/               # Documentación
```

### Tecnologías Implementadas

#### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool rápido
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Lucide Icons** - Iconos modernos

#### Backend
- **Node.js + Express** - Servidor web
- **Prisma ORM** - Base de datos
- **PostgreSQL** - Base de datos relacional
- **Wasp Auth** - Sistema de autenticación

#### Servicios Integrados
- **Stripe** - Pagos y suscripciones
- **LemonSqueezy** - Alternativa de pagos
- **Fly.io** - Deployment automático
- **Plausible** - Analytics privacy-first

---

## 📊 Estado de Desarrollo

### ✅ Completado

- [x] **Instalación de Wasp CLI**
- [x] **Configuración del proyecto Open SaaS**
- [x] **Base de datos PostgreSQL funcionando**
- [x] **Aplicación ejecutándose en localhost:3000**
- [x] **Sistema de autenticación activo**
- [x] **Personalización básica (títulos, meta tags)**
- [x] **Repositorio GitHub creado**

### 🔄 En Progreso

- [ ] **Personalización del branding**
- [ ] **Configuración del modelo de datos para pádel**
- [ ] **Dashboard administrativo personalizado**

### 📋 Pendiente

- [ ] **Módulo de gestión de pistas**
- [ ] **Sistema de reservas específico**
- [ ] **Analytics de clubes**
- [ ] **Página pública personalizada**

---

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/Timmur/padel-club-manager-pro.git
cd padel-club-manager-pro

# Navegar al directorio de la aplicación
cd app

# Iniciar todo el stack
wasp start

# Solo base de datos
wasp db start

# Solo migraciones
wasp db migrate-dev

# Abrir Prisma Studio
wasp db studio
```

### Debugging

```bash
# Ver logs de la aplicación
wasp start --verbose

# Resetear base de datos
wasp db reset

# Verificar estado de containers
docker ps
```

### Desarrollo Frontend

```bash
# Instalar dependencias adicionales
cd app && npm install [package-name]

# Ejecutar linter
cd app && npm run lint

# Ejecutar tests
cd app && npm run test
```

---

## 🔧 Solución de Problemas

### Error: "wasp: command not found"

```bash
# Verificar PATH en WSL
echo $PATH
export PATH=$PATH:/home/timur/.local/bin

# Agregar a .bashrc permanente
echo 'export PATH=$PATH:/home/timur/.local/bin' >> ~/.bashrc
```

### Error: "Docker not running"

```bash
# Verificar Docker Desktop
docker --version
docker ps

# Reiniciar Docker Desktop si es necesario
```

### Error: "Port 3000 already in use"

```bash
# Matar procesos en puerto 3000
taskkill /F /IM node.exe
netstat -ano | findstr :3000
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Wasp**: https://wasp-lang.dev/docs
- **Open SaaS**: https://opensaas.sh/docs
- **Prisma**: https://www.prisma.io/docs
- **React**: https://react.dev/learn

### Archivos de Configuración

- `app/main.wasp` - Configuración principal
- `app/.env.server` - Variables de entorno servidor
- `app/.env.client` - Variables de entorno cliente
- `package.json` - Scripts y dependencias raíz

### Próximos Pasos

1. **Personalizar el branding** con colores y logo del club
2. **Configurar modelo de datos** específico para pádel
3. **Implementar dashboard** administrativo
4. **Crear módulo de pistas** y reservas
5. **Desarrollar página pública** para jugadores

---

**🎉 ¡Proyecto exitosamente arrancado el 18 de Julio, 2025!**

Aplicación funcionando en: **http://localhost:3000**