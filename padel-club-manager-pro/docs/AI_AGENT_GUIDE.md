# Guía de Extensión para Agentes AI

## Resumen

Esta guía proporciona instrucciones específicas para que los agentes AI puedan extender y personalizar el sistema Padel Club Manager Pro de manera efectiva. Incluye patrones, convenciones y mejores prácticas para el desarrollo automatizado.

## Estructura del Proyecto

### Convenciones de Naming

```typescript
// Entidades: PascalCase
entity Court, Booking, Match, Payment

// Componentes: PascalCase
CourtList, BookingForm, MatchCard

// Archivos: camelCase
courtService.ts, bookingUtils.ts, matchHelpers.ts

// Páginas: PascalCase
DashboardPage, MatchesPage, CalendarPage

// Rutas: camelCase
dashboardRoute, matchesRoute, calendarRoute

// Queries/Actions: camelCase
getCourtAvailability, createBooking, updateMatch
```

### Estructura de Archivos

```
src/
├── client/                 # Frontend
│   ├── components/        # Componentes reutilizables
│   │   ├── common/       # Componentes comunes
│   │   ├── forms/        # Formularios
│   │   ├── layout/       # Layout y navegación
│   │   └── ui/           # Componentes UI básicos
│   ├── pages/            # Páginas principales
│   │   ├── dashboard/    # Dashboard y métricas
│   │   ├── matches/      # Gestión de partidos
│   │   ├── calendar/     # Calendario de pistas
│   │   ├── chat/         # Sistema de comunicación
│   │   ├── public/       # Página pública
│   │   └── billing/      # Facturación
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilidades del cliente
│   └── types/            # Tipos TypeScript
├── server/               # Backend
│   ├── actions/          # Wasp Actions
│   ├── queries/          # Wasp Queries
│   ├── jobs/             # Trabajos en segundo plano
│   ├── services/         # Servicios de dominio
│   ├── utils/            # Utilidades del servidor
│   └── types/            # Tipos del servidor
└── shared/               # Código compartido
    ├── constants/        # Constantes
    ├── types/            # Tipos compartidos
    └── utils/            # Utilidades compartidas
```

## Patrones de Desarrollo

### 1. Creación de Nuevas Entidades

#### Paso 1: Definir en Prisma Schema
```prisma
// schema.prisma
model Court {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isActive      Boolean  @default(true)
  pricePerHour  Float
  club          Club     @relation(fields: [clubId], references: [id])
  clubId        String
  bookings      Booking[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### Paso 2: Declarar en main.wasp
```wasp
entity Court {=psl
  id            String   @id @default(cuid())
  name          String
  description   String?
  isActive      Boolean  @default(true)
  pricePerHour  Float
  club          Club     @relation(fields: [clubId], references: [id])
  clubId        String
  bookings      Booking[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
psl=}
```

#### Paso 3: Crear Queries y Actions
```wasp
// Queries
query getCourts {
  fn: import { getCourts } from "@src/server/queries",
  entities: [Court, Club]
}

query getCourtById {
  fn: import { getCourtById } from "@src/server/queries",
  entities: [Court]
}

// Actions
action createCourt {
  fn: import { createCourt } from "@src/server/actions",
  entities: [Court, Club]
}

action updateCourt {
  fn: import { updateCourt } from "@src/server/actions",
  entities: [Court]
}

action deleteCourt {
  fn: import { deleteCourt } from "@src/server/actions",
  entities: [Court]
}
```

### 2. Implementación de Servicios

#### Estructura de Servicio
```typescript
// src/server/services/courtService.ts
import { Court, Club } from 'wasp/entities';
import { HttpError } from 'wasp/server';

export class CourtService {
  static async getCourtsByClub(clubId: string): Promise<Court[]> {
    // Implementación
  }

  static async validateCourtAvailability(
    courtId: string, 
    startTime: Date, 
    endTime: Date
  ): Promise<boolean> {
    // Implementación
  }

  static async createCourt(data: CreateCourtData): Promise<Court> {
    // Implementación con validaciones
  }
}
```

### 3. Creación de Componentes

#### Componente de Lista
```typescript
// src/client/components/court/CourtList.tsx
import React from 'react';
import { getCourts } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/router';

interface CourtListProps {
  clubId: string;
}

export const CourtList: React.FC<CourtListProps> = ({ clubId }) => {
  const { data: courts, isLoading, error } = useQuery(getCourts, { clubId });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courts?.map(court => (
        <CourtCard key={court.id} court={court} />
      ))}
    </div>
  );
};
```

#### Componente de Formulario
```typescript
// src/client/components/court/CourtForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { createCourt } from 'wasp/client/operations';

export const CourtForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const createCourtFn = createCourt();

  const onSubmit = async (data: any) => {
    try {
      await createCourtFn(data);
      // Éxito
    } catch (error) {
      // Error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Nombre</label>
        <input
          {...register('name', { required: 'El nombre es requerido' })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      {/* Más campos */}
      <button type="submit" className="btn btn-primary">
        Crear Pista
      </button>
    </form>
  );
};
```

### 4. Creación de Páginas

#### Estructura de Página
```typescript
// src/client/pages/courts/CourtsPage.tsx
import React from 'react';
import { CourtList } from '@src/client/components/court/CourtList';
import { CourtForm } from '@src/client/components/court/CourtForm';

export const CourtsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Pistas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CourtList clubId="current-club-id" />
        </div>
        <div>
          <CourtForm />
        </div>
      </div>
    </div>
  );
};
```

#### Declaración en main.wasp
```wasp
route CourtsRoute { path: "/courts", to: CourtsPage }
page CourtsPage {
  component: import { CourtsPage } from "@src/client/pages/courts/CourtsPage",
  authRequired: true
}
```

## Implementación de Funcionalidades Específicas

### 1. Dashboard de Métricas

#### KPIs Principales
```typescript
// src/server/queries/metricsQueries.ts
export const getDashboardMetrics = async (args: any, context: any) => {
  const { user } = context;
  
  const metrics = {
    totalBookings: await getBookingCount(user.clubId),
    revenue: await getMonthlyRevenue(user.clubId),
    activeUsers: await getActiveUserCount(user.clubId),
    courtUtilization: await getCourtUtilization(user.clubId)
  };

  return metrics;
};
```

#### Componente de Gráfico
```typescript
// src/client/components/dashboard/RevenueChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const RevenueChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
    </LineChart>
  );
};
```

### 2. Sistema de Calendario

#### Componente de Calendario
```typescript
// src/client/components/calendar/CourtCalendar.tsx
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export const CourtCalendar: React.FC = () => {
  const events = [
    // Eventos de reservas
  ];

  return (
    <div className="h-screen">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};
```

### 3. Sistema de Chat

#### WebSocket Setup
```typescript
// src/server/websocket.ts
import { Server } from 'socket.io';

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.WASP_WEB_CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send-message', (data) => {
      io.to(data.roomId).emit('receive-message', data);
    });
  });

  return io;
};
```

#### Componente de Chat
```typescript
// src/client/components/chat/ChatRoom.tsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const ChatRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit('join-room', roomId);

    newSocket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => newSocket.close();
  }, [roomId]);

  const sendMessage = () => {
    if (socket && inputMessage.trim()) {
      socket.emit('send-message', {
        roomId,
        message: inputMessage,
        userId: 'current-user-id'
      });
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-b">
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex p-2">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={sendMessage} className="ml-2 btn btn-primary">
          Enviar
        </button>
      </div>
    </div>
  );
};
```

## Validaciones y Seguridad

### 1. Validaciones del Servidor
```typescript
// src/server/utils/validations.ts
import { z } from 'zod';

export const createCourtSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  pricePerHour: z.number().positive('El precio debe ser positivo'),
  clubId: z.string().cuid('ID de club inválido')
});

export const validateCreateCourt = (data: any) => {
  return createCourtSchema.parse(data);
};
```

### 2. Middleware de Autorización
```typescript
// src/server/middleware/authMiddleware.ts
import { HttpError } from 'wasp/server';

export const requireClubAccess = async (user: any, clubId: string) => {
  if (!user) {
    throw new HttpError(401, 'No autorizado');
  }

  if (user.clubId !== clubId) {
    throw new HttpError(403, 'Sin permisos para acceder a este club');
  }
};
```

## Testing

### 1. Tests de Componentes
```typescript
// src/client/components/court/__tests__/CourtList.test.tsx
import { render, screen } from '@testing-library/react';
import { CourtList } from '../CourtList';

describe('CourtList', () => {
  it('renders court list correctly', () => {
    render(<CourtList clubId="test-club" />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });
});
```

### 2. Tests de Queries/Actions
```typescript
// src/server/__tests__/courtActions.test.ts
import { createCourt } from '../actions/courtActions';

describe('createCourt', () => {
  it('creates a court successfully', async () => {
    const mockData = {
      name: 'Pista 1',
      pricePerHour: 25.0,
      clubId: 'test-club-id'
    };

    const result = await createCourt(mockData, { user: mockUser });
    expect(result.name).toBe('Pista 1');
  });
});
```

## Mejores Prácticas para Agentes AI

### 1. Siempre Seguir la Estructura
- Crear archivos en las ubicaciones correctas
- Seguir convenciones de naming
- Mantener consistencia en el código

### 2. Implementar Validaciones
- Validar datos en el servidor
- Manejar errores apropiadamente
- Proporcionar feedback al usuario

### 3. Mantener la Seguridad
- Verificar autenticación en todas las operaciones
- Validar permisos por club/usuario
- Sanitizar datos de entrada

### 4. Escribir Tests
- Escribir tests para componentes importantes
- Testear queries y actions
- Verificar casos edge

### 5. Documentar el Código
- Comentar funciones complejas
- Mantener README actualizado
- Documentar APIs públicas

## Comandos Útiles

```bash
# Regenerar cliente de Prisma
wasp db generate

# Aplicar migraciones
wasp db migrate-dev

# Resetear base de datos
wasp db reset

# Ejecutar seeds
wasp db seed

# Ejecutar tests
wasp test

# Linting
wasp lint

# Build para producción
wasp build
```

## Recursos Adicionales

- [Documentación de Wasp](https://wasp.sh/docs)
- [Guía de OpenSaaS](https://docs.opensaas.sh)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Conclusión

Esta guía proporciona una base sólida para que los agentes AI puedan extender el sistema de manera efectiva. Siguiendo estos patrones y convenciones, se asegura la consistencia y mantenibilidad del código generado automáticamente.
