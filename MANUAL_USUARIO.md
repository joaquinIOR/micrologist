# Manual de Usuario — MicroLogist

**Plataforma de gestión de flotas para transporte urbano**  
Versión 1.0 | Junio 2026

---

## Índice

1. [Primeros pasos](#1-primeros-pasos)
2. [Dashboard principal](#2-dashboard-principal)
3. [Gestión de buses](#3-gestión-de-buses)
4. [Gestión de conductores](#4-gestión-de-conductores)
5. [Turnos](#5-turnos)
6. [Ingresos](#6-ingresos)
7. [Alertas](#7-alertas)
8. [Mi Perfil](#8-mi-perfil)
9. [Recuperar contraseña](#9-recuperar-contraseña)
10. [Planes disponibles](#10-planes-disponibles)

---

## 1. Primeros pasos

### Registro

1. Ingresa a **micrologist.vercel.app**
2. Haz click en **Comenzar gratis**
3. Completa el formulario:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
   - Nombre de tu empresa (opcional)
   - Ciudad
4. Haz click en **Registrarme**

Al registrarte quedas en el plan **Estándar** (15 buses, 15 conductores).

### Inicio de sesión

1. Ingresa tu correo y contraseña
2. Si te equivocas 5 veces en 5 minutos, debes esperar antes de volver a intentarlo

---

## 2. Dashboard principal

Al iniciar sesión verás el resumen de tu flota:

| Sección | Qué muestra |
|---------|-------------|
| Tarjetas superiores | Buses activos, conductores, alertas críticas, ingresos del mes |
| Semáforo de flota | Conteo de buses en estado OK / ALERTA / CRÍTICO |
| Tabla de buses | Todos tus buses con su estado de documentos |
| Tabla de conductores | Conductores con estado de licencia |
| Próximos turnos | Turnos programados para los próximos 7 días |

### Sistema semáforo

El sistema calcula automáticamente el estado de cada bus según sus documentos:

- **OK** (verde): todos los documentos vigentes y con más de 30 días
- **ALERTA** (amarillo): algún documento vence en los próximos 30 días
- **CRÍTICO** (rojo): algún documento ya venció

Los documentos controlados son: Revisión Técnica, SOAP y Permiso de Circulación.

---

## 3. Gestión de buses

### Agregar un bus

1. Dashboard → **Buses** → **Nuevo bus**
2. Ingresa:
   - **Patente** (obligatorio)
   - Marca, modelo, año, color
   - Recorrido habitual
   - Fechas de vencimiento: Revisión Técnica, SOAP, Permiso de Circulación
   - Notas adicionales
3. Click en **Guardar**

### Editar un bus

1. En la tabla de buses, click en el ícono de lápiz (✏️)
2. Modifica los campos necesarios
3. Click en **Guardar**

### Eliminar un bus

1. En la tabla de buses, click en el ícono de basura (🗑️)
2. Confirma la eliminación

> **Importante:** Eliminar un bus también elimina todos sus turnos e ingresos asociados.

### Estados del bus

- **Activo**: en operación normal
- **En mantención**: fuera de servicio temporalmente
- **Inactivo**: fuera de servicio permanentemente

---

## 4. Gestión de conductores

### Agregar un conductor

1. Dashboard → **Conductores** → **Nuevo conductor**
2. Ingresa:
   - **Nombre** (obligatorio)
   - RUT
   - Teléfono, email, WhatsApp
   - Tipo de licencia y fecha de vencimiento
   - Notas
3. Click en **Guardar**

### Semáforo de licencia

Funciona igual que el semáforo de buses:
- Verde: licencia vigente con más de 30 días
- Amarillo: vence en los próximos 30 días
- Rojo: licencia vencida

---

## 5. Turnos

Los turnos asignan un bus y un conductor a una fecha y jornada específica.

### Crear un turno

1. Dashboard → **Turnos** → **Nuevo turno**
2. Selecciona:
   - **Fecha**
   - **Tipo**: Mañana (AM) / Tarde (PM)
   - **Bus**
   - **Conductor**
3. Click en **Guardar**

> El sistema no permite asignar el mismo bus o conductor dos veces en el mismo día y jornada.

### Ver turnos

La vista de turnos muestra el calendario semanal. Puedes navegar semana a semana con los botones de fecha.

---

## 6. Ingresos

Registra la recaudación diaria de cada bus.

### Agregar ingreso

1. Dashboard → **Ingresos** → **Nuevo ingreso**
2. Completa:
   - **Fecha**
   - **Bus** (selecciona de la lista)
   - **Monto** ($)
   - Pasajeros transportados
   - Recorrido
   - Notas
3. Click en **Guardar**

### Importar desde CSV

Si tienes datos históricos en Excel:
1. Exporta el Excel como CSV (separado por comas)
2. En Ingresos → **Importar CSV**
3. Sube el archivo y mapea las columnas al nombre correcto
4. Click en **Importar**

### Editar un ingreso

En la tabla de ingresos, click en el ícono de lápiz (✏️) de cualquier fila.

### Resumen mensual

La sección de ingresos muestra un gráfico con la evolución diaria y el total del período seleccionado.

---

## 7. Alertas

### Ver alertas

Dashboard → **Alertas** (en el menú lateral)

Se muestran todos los documentos próximos a vencer o vencidos, ordenados por urgencia.

### Recibir alertas por WhatsApp

Para recibir notificaciones automáticas:

1. Ve a **Mi Perfil** → agrega tu número de WhatsApp en el campo Teléfono (formato: +56912345678)
2. Guarda los cambios
3. Cada mañana a las 08:00 recibirás un resumen de tus alertas activas

También puedes enviar el resumen manualmente desde **Mi Perfil** → **Enviar alertas por WhatsApp**.

---

## 8. Mi Perfil

Accede desde el menú superior → ícono de usuario → **Mi Perfil**

Puedes actualizar:
- Nombre
- Empresa
- Ciudad
- Teléfono/WhatsApp

El correo electrónico **no se puede cambiar** una vez registrado.

### Descargar reporte PDF

Desde **Mi Perfil** → **Descargar reporte PDF**

Genera un PDF con el estado completo de tu flota:
- Resumen ejecutivo (buses, conductores, ingresos del mes)
- Tabla de buses con estado semáforo
- Lista de conductores
- Alertas críticas

---

## 9. Recuperar contraseña

1. En la pantalla de login, click en **¿Olvidaste tu contraseña?**
2. Ingresa tu correo electrónico
3. Si tienes un número de WhatsApp registrado, recibirás un link de recuperación
4. El link expira en 1 hora
5. Ingresa tu nueva contraseña (mínimo 6 caracteres)

---

## 10. Planes disponibles

| Plan | Buses | Conductores | Precio |
|------|-------|-------------|--------|
| **Básico** | 5 | 5 | $25.000/mes |
| **Estándar** | 15 | 15 | $45.000/mes |
| **Enterprise** | Ilimitado | Ilimitado | Precio especial |

Para cambiar de plan, contacta a soporte.

---

## Soporte

- **Email:** soporte@micrologist.cl
- **WhatsApp:** disponible en el plan Enterprise

---

*MicroLogist — Simplificando la gestión de flotas urbanas*
