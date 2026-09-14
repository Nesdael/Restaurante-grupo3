# =============================================================
#  Setup del tablero Kanban en GitHub - Restaurante grupo 3
#  Crea: labels, milestones (Sprint 1 y 2) y las 10 issues.
#
#  Requisitos:
#    1. GitHub CLI instalado  ->  winget install --id GitHub.cli
#    2. Autenticado           ->  gh auth login
#    3. Ejecutar este script DENTRO de la carpeta del repositorio
#
#  Uso (PowerShell, parado en la carpeta del repo):
#    .\setup-kanban.ps1
# =============================================================

$ErrorActionPreference = "Stop"

Write-Host "`n== Verificando GitHub CLI ==" -ForegroundColor Cyan
gh auth status
$repo = gh repo view --json nameWithOwner -q .nameWithOwner
Write-Host "Repositorio: $repo" -ForegroundColor Green

# -------------------------------------------------------------
# 1. LABELS
# -------------------------------------------------------------
Write-Host "`n== Creando labels ==" -ForegroundColor Cyan

$labels = @(
  @{ name = "user story";           color = "0e8a16"; desc = "Historia de usuario del backlog" },
  @{ name = "bug";                  color = "d73a4a"; desc = "Algo no funciona como debería" },
  @{ name = "documentation";        color = "0075ca"; desc = "README, Swagger, guías" },
  @{ name = "chore";                color = "cfd3d7"; desc = "Configuración, dependencias, mantenimiento" },

  @{ name = "epic: infrastructure"; color = "5319e7"; desc = "Arquitectura e Infraestructura" },
  @{ name = "epic: operations";     color = "5319e7"; desc = "Gestión Operativa" },
  @{ name = "epic: menu";           color = "5319e7"; desc = "Gestión del Menú" },
  @{ name = "epic: reservations";   color = "5319e7"; desc = "Gestión de Reservas" },

  @{ name = "priority: critical";   color = "b60205"; desc = "Prioridad crítica" },
  @{ name = "priority: very high";  color = "e99695"; desc = "Prioridad muy alta" },
  @{ name = "priority: high";       color = "fbca04"; desc = "Prioridad alta" },

  @{ name = "points: 8";            color = "1d76db"; desc = "8 story points" },
  @{ name = "points: 13";           color = "1d76db"; desc = "13 story points" },

  @{ name = "blocked";              color = "000000"; desc = "Bloqueada por otra historia" }
)

foreach ($l in $labels) {
  gh label create $l.name --color $l.color --description $l.desc --force | Out-Null
  Write-Host ("  + {0}" -f $l.name)
}

# -------------------------------------------------------------
# 2. MILESTONES (Sprints)
# -------------------------------------------------------------
Write-Host "`n== Creando milestones ==" -ForegroundColor Cyan

gh api "repos/$repo/milestones" -f title="Sprint 1" `
  -f description="Infraestructura y Gestión Base - HU-001 a HU-005 (55 story points)" | Out-Null
Write-Host "  + Sprint 1"

gh api "repos/$repo/milestones" -f title="Sprint 2" `
  -f description="Gestión de Reservas - HU-006 a HU-010 (55 story points)" | Out-Null
Write-Host "  + Sprint 2"

# -------------------------------------------------------------
# 3. ISSUES
# -------------------------------------------------------------
Write-Host "`n== Creando issues ==" -ForegroundColor Cyan

function New-HU {
  param($Title, $Milestone, $Labels, $Body)
  $file = New-TemporaryFile
  # UTF-8 sin BOM para que GitHub no muestre caracteres raros
  [System.IO.File]::WriteAllText($file.FullName, $Body, (New-Object System.Text.UTF8Encoding $false))
  gh issue create --title $Title --body-file $file.FullName --milestone $Milestone --label $Labels | Out-Null
  Remove-Item $file.FullName
  Write-Host ("  + {0}" -f $Title)
}

# ---------------------------- HU-001 -------------------------
New-HU -Title "HU-001 - Configuración de la Plataforma Base" `
  -Milestone "Sprint 1" `
  -Labels "user story,epic: infrastructure,priority: critical,points: 8" `
  -Body @'
**Épica:** Arquitectura e Infraestructura · **Story Points:** 8 · **Prioridad:** Crítica · **Dependencias:** Ninguna

## Historia de usuario

**Como** equipo de desarrollo
**Quiero** disponer de una arquitectura base con Node.js, TypeScript, NestJS, PostgreSQL, Prisma ORM y Docker
**Para** desarrollar las funcionalidades del restaurante bajo un entorno estandarizado, modular y fácilmente desplegable.

## Alcance

- Proyecto NestJS con arquitectura modular (`src/modules/`)
- PostgreSQL + Prisma ORM + Prisma Migrate
- Docker y Docker Compose (`restaurant-api` + `postgres`)
- `@nestjs/config` y `.env.example` documentado
- `ValidationPipe` global, Helmet y CORS
- Swagger en `/api/docs`, API bajo el prefijo `/api/v1`
- Jest, ESLint y Prettier configurados

## Endpoint

```http
GET /api/v1/health  ->  200  { "status": "ok", "service": "restaurant-api" }
```

## Criterios de aceptación

- [ ] Docker Compose levanta correctamente los servicios requeridos
- [ ] PostgreSQL inicia correctamente
- [ ] La aplicación NestJS inicia correctamente
- [ ] Prisma conecta con PostgreSQL y el Prisma Client se genera
- [ ] Las migraciones se ejecutan correctamente
- [ ] `GET /api/v1/health` responde `200`
- [ ] Swagger está disponible
- [ ] La API usa versionado `/api/v1`
- [ ] `ValidationPipe`, Helmet y CORS configurados
- [ ] Jest, ESLint y Prettier configurados
- [ ] `.env.example` y README documentados
- [ ] Otro desarrollador puede levantar el proyecto solo con el README

## Rama sugerida

`chore/HU-001-project-setup`
'@

# ---------------------------- HU-002 -------------------------
New-HU -Title "HU-002 - Administración de Mesas" `
  -Milestone "Sprint 1" `
  -Labels "user story,epic: operations,priority: very high,points: 13" `
  -Body @'
**Épica:** Gestión Operativa · **Story Points:** 13 · **Prioridad:** Muy Alta · **Dependencias:** HU-001

## Historia de usuario

**Como** administrador del restaurante
**Quiero** registrar y administrar las mesas disponibles
**Para** controlar la capacidad y disponibilidad del restaurante para reservas y pedidos.

## Descripción

Cada mesa contiene número, capacidad, zona y estado (`AVAILABLE`, `OCCUPIED`, `OUT_OF_SERVICE`).
Se puede filtrar por estado, zona y capacidad.

## Reglas de negocio

- **RN-016** El número de mesa debe ser único
- **RN-017** La capacidad debe ser mayor que cero
- **RN-018** Toda mesa nueva inicia en `AVAILABLE`
- **RN-019** Una mesa `OUT_OF_SERVICE` no puede usarse para reservas o pedidos
- **RN-020** Solo se permiten estados definidos por el sistema

## Endpoints

```http
POST   /api/v1/tables
GET    /api/v1/tables
GET    /api/v1/tables/{id}
PATCH  /api/v1/tables/{id}
PATCH  /api/v1/tables/{id}/status
```

## Criterios de aceptación

- [ ] Se puede registrar una mesa correctamente
- [ ] No se permiten números de mesa duplicados
- [ ] Se puede consultar el listado de mesas
- [ ] Se puede consultar una mesa específica
- [ ] Se puede actualizar una mesa
- [ ] Se puede cambiar su estado
- [ ] Los filtros (estado, zona, capacidad) funcionan correctamente
- [ ] Los datos quedan almacenados en PostgreSQL

## Rama sugerida

`feat/HU-002-table-management`  ·  **scope de commits:** `tables`
'@

# ---------------------------- HU-003 -------------------------
New-HU -Title "HU-003 - Administración de Categorías del Menú" `
  -Milestone "Sprint 1" `
  -Labels "user story,epic: menu,priority: high,points: 8" `
  -Body @'
**Épica:** Gestión del Menú · **Story Points:** 8 · **Prioridad:** Alta · **Dependencias:** HU-001

## Historia de usuario

**Como** administrador del restaurante
**Quiero** crear y administrar categorías del menú
**Para** organizar correctamente los productos disponibles para los clientes.

## Descripción

Cada categoría contiene nombre, descripción y estado (`ACTIVE`, `INACTIVE`).
Ejemplos: Entradas, Platos fuertes, Bebidas, Postres.

## Reglas de negocio

- **RN-021** El nombre de la categoría debe ser único
- **RN-022** Toda categoría nueva inicia en `ACTIVE`
- **RN-023** Una categoría `INACTIVE` no se muestra en el menú público
- **RN-024** Solo se permiten estados definidos por el sistema

## Endpoints

```http
POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/{id}
PATCH  /api/v1/categories/{id}
PATCH  /api/v1/categories/{id}/status
```

## Criterios de aceptación

- [ ] Se puede registrar una categoría correctamente
- [ ] No se permiten nombres duplicados
- [ ] Se puede consultar el listado de categorías
- [ ] Se puede consultar una categoría específica
- [ ] Se puede actualizar una categoría
- [ ] Se puede activar o desactivar una categoría
- [ ] Las categorías inactivas no se muestran en el menú público
- [ ] Los datos quedan almacenados en PostgreSQL

## Rama sugerida

`feat/HU-003-menu-categories`  ·  **scope de commits:** `categories`
'@

# ---------------------------- HU-004 -------------------------
New-HU -Title "HU-004 - Administración de Productos del Menú" `
  -Milestone "Sprint 1" `
  -Labels "user story,epic: menu,priority: very high,points: 13" `
  -Body @'
**Épica:** Gestión del Menú · **Story Points:** 13 · **Prioridad:** Muy Alta · **Dependencias:** HU-003

## Historia de usuario

**Como** administrador del restaurante
**Quiero** crear y administrar los productos disponibles en el menú
**Para** mantener actualizada la oferta de platos, bebidas y demás productos.

## Descripción

Cada producto contiene nombre, descripción, precio, categoría, disponibilidad (`AVAILABLE`, `UNAVAILABLE`) y estado (`ACTIVE`, `INACTIVE`).

## Reglas de negocio

- **RN-025** Todo producto debe pertenecer a una categoría existente
- **RN-026** El precio debe ser mayor que cero
- **RN-027** Todo producto nuevo inicia en `ACTIVE`
- **RN-028** Todo producto nuevo inicia como `AVAILABLE`
- **RN-029** Un producto `INACTIVE` no se muestra en el menú público
- **RN-030** Un producto `UNAVAILABLE` sigue registrado pero no puede agregarse a nuevos pedidos

## Endpoints

```http
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/{id}
PATCH  /api/v1/products/{id}
PATCH  /api/v1/products/{id}/status
PATCH  /api/v1/products/{id}/availability
```

## Criterios de aceptación

- [ ] Se puede registrar un producto correctamente
- [ ] El producto queda asociado a una categoría existente
- [ ] No se permiten precios iguales o menores a cero
- [ ] Se puede consultar el listado y el detalle de un producto
- [ ] Se puede actualizar un producto
- [ ] Se puede activar o desactivar un producto
- [ ] Se puede cambiar su disponibilidad
- [ ] Los productos inactivos no se muestran en el menú público
- [ ] Los productos no disponibles no pueden usarse en nuevos pedidos
- [ ] Los datos quedan almacenados en PostgreSQL

## Rama sugerida

`feat/HU-004-menu-products`  ·  **scope de commits:** `products`
'@

# ---------------------------- HU-005 -------------------------
New-HU -Title "HU-005 - Consulta del Menú del Restaurante" `
  -Milestone "Sprint 1" `
  -Labels "user story,epic: menu,priority: very high,points: 13" `
  -Body @'
**Épica:** Gestión del Menú · **Story Points:** 13 · **Prioridad:** Muy Alta · **Dependencias:** HU-003, HU-004

## Historia de usuario

**Como** cliente del restaurante
**Quiero** consultar el menú disponible
**Para** conocer los productos ofrecidos antes de realizar un pedido.

## Descripción

El menú público muestra únicamente categorías y productos `ACTIVE`, organizados por categoría.
Los productos `UNAVAILABLE` se muestran marcados como no disponibles y no son seleccionables.

## Reglas de negocio

- **RN-031** Solo se muestran categorías con estado `ACTIVE`
- **RN-032** Solo se muestran productos con estado `ACTIVE`
- **RN-033** Los productos `UNAVAILABLE` se identifican como no disponibles
- **RN-034** Los productos se muestran asociados a su categoría
- **RN-035** El menú refleja los cambios de disponibilidad hechos por administración

## Endpoints

```http
GET /api/v1/menu
GET /api/v1/menu/categories
GET /api/v1/menu/categories/{categoryId}/products
GET /api/v1/menu/products/{id}
```

## Criterios de aceptación

- [ ] Se puede consultar el menú completo
- [ ] Solo aparecen categorías activas
- [ ] Solo aparecen productos activos
- [ ] Los productos se muestran organizados por categoría
- [ ] Los productos no disponibles se identifican correctamente
- [ ] Se puede consultar una categoría específica
- [ ] Se puede consultar el detalle de un producto
- [ ] Los cambios de administración se reflejan en el menú

## Rama sugerida

`feat/HU-005-menu-query`  ·  **scope de commits:** `menu`
'@

# ---------------------------- HU-006 -------------------------
New-HU -Title "HU-006 - Consulta de Disponibilidad de Mesas" `
  -Milestone "Sprint 2" `
  -Labels "user story,epic: reservations,priority: critical,points: 13" `
  -Body @'
**Épica:** Gestión de Reservas · **Story Points:** 13 · **Prioridad:** Crítica · **Dependencias:** HU-002

## Historia de usuario

**Como** cliente del restaurante
**Quiero** consultar la disponibilidad de mesas para una fecha, hora y cantidad de personas
**Para** saber si puedo realizar una reserva.

## Descripción

El sistema consulta las mesas operativas, con capacidad suficiente y sin conflicto de horario con reservas existentes.

## Reglas de negocio

- **RN-036** La cantidad de personas debe ser mayor que cero
- **RN-037** No se permite consultar disponibilidad para fechas u horas pasadas
- **RN-038** Solo se consideran mesas con estado `AVAILABLE`
- **RN-039** La capacidad de la mesa debe ser igual o superior a las personas solicitadas
- **RN-040** Una mesa con reserva en conflicto de horario no está disponible
- **RN-041** Las mesas `OUT_OF_SERVICE` no pueden usarse para reservas

## Endpoint

```http
GET /api/v1/reservations/availability?date=2026-09-20&time=19:00&guests=4
```

## Criterios de aceptación

- [ ] Se puede consultar disponibilidad con fecha, hora y número de personas
- [ ] Solo se consideran mesas operativas
- [ ] Solo se muestran mesas con capacidad suficiente
- [ ] No se muestran mesas con conflictos de reserva
- [ ] No se permiten consultas para fechas pasadas
- [ ] El sistema informa correctamente cuando no hay disponibilidad
- [ ] La disponibilidad refleja las reservas registradas en PostgreSQL

## Rama sugerida

`feat/HU-006-reservation-availability`  ·  **scope de commits:** `reservations`
'@

# ---------------------------- HU-007 -------------------------
New-HU -Title "HU-007 - Registro de Reserva" `
  -Milestone "Sprint 2" `
  -Labels "user story,epic: reservations,priority: critical,points: 13" `
  -Body @'
**Épica:** Gestión de Reservas · **Story Points:** 13 · **Prioridad:** Crítica · **Dependencias:** HU-002, HU-006

## Historia de usuario

**Como** cliente del restaurante
**Quiero** registrar una reserva para una fecha y hora determinada
**Para** asegurar una mesa disponible antes de asistir al restaurante.

## Descripción

El cliente envía nombre, teléfono, correo, fecha, hora y cantidad de personas.
La reserva se asocia a una mesa y se guarda con estado `PENDING`.

Estados: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `CANCELLED`, `NO_SHOW`, `COMPLETED`.

## Reglas de negocio

- **RN-042** No se permite registrar reservas para fechas u horas pasadas
- **RN-043** La cantidad de personas debe ser mayor que cero
- **RN-044** La reserva solo se crea si existe una mesa con capacidad suficiente
- **RN-045** Una mesa no puede asignarse a dos reservas con conflicto de horario
- **RN-046** Toda reserva nueva inicia con estado `PENDING`
- **RN-047** La mesa asignada debe estar operativa al momento de registrar

## Endpoint

```http
POST /api/v1/reservations
```

```json
{
  "customerName": "Carlos Pérez",
  "phone": "3001234567",
  "email": "carlos@example.com",
  "date": "2026-09-20",
  "time": "19:00",
  "guests": 4
}
```

## Criterios de aceptación

- [ ] El cliente puede registrar una reserva correctamente
- [ ] La reserva queda asociada a una mesa disponible
- [ ] La reserva inicia con estado `PENDING`
- [ ] No se permiten reservas para fechas pasadas
- [ ] No se permiten reservas sin disponibilidad
- [ ] No se generan conflictos de horario sobre una misma mesa
- [ ] La reserva queda almacenada correctamente en PostgreSQL

## Rama sugerida

`feat/HU-007-create-reservation`  ·  **scope de commits:** `reservations`
'@

# ---------------------------- HU-008 -------------------------
New-HU -Title "HU-008 - Consulta de Reserva" `
  -Milestone "Sprint 2" `
  -Labels "user story,epic: reservations,priority: high,points: 8" `
  -Body @'
**Épica:** Gestión de Reservas · **Story Points:** 8 · **Prioridad:** Alta · **Dependencias:** HU-007

## Historia de usuario

**Como** cliente del restaurante
**Quiero** consultar la información y el estado de mi reserva
**Para** verificar los datos registrados antes de asistir al restaurante.

## Descripción

Muestra identificador, nombre del cliente, fecha, hora, cantidad de personas, mesa asignada y estado.
El personal autorizado puede consultar el listado completo.

## Reglas de negocio

- **RN-048** Solo pueden consultarse reservas existentes
- **RN-049** Una reserva siempre muestra su estado actual
- **RN-050** La información de la mesa asignada se incluye cuando existe asignación
- **RN-051** Las reservas canceladas o finalizadas se conservan como historial

## Endpoints

```http
GET /api/v1/reservations
GET /api/v1/reservations/{id}
```

## Criterios de aceptación

- [ ] Se puede consultar una reserva específica
- [ ] Se muestra correctamente el estado actual
- [ ] Se muestra la mesa asignada
- [ ] Una reserva inexistente retorna un error controlado
- [ ] El personal autorizado puede consultar el listado de reservas
- [ ] Las reservas canceladas y completadas siguen disponibles para consulta histórica

## Rama sugerida

`feat/HU-008-get-reservation`  ·  **scope de commits:** `reservations`
'@

# ---------------------------- HU-009 -------------------------
New-HU -Title "HU-009 - Modificación de Reserva" `
  -Milestone "Sprint 2" `
  -Labels "user story,epic: reservations,priority: very high,points: 13" `
  -Body @'
**Épica:** Gestión de Reservas · **Story Points:** 13 · **Prioridad:** Muy Alta · **Dependencias:** HU-006, HU-007, HU-008

## Historia de usuario

**Como** cliente del restaurante
**Quiero** modificar los datos de mi reserva
**Para** ajustar la fecha, hora o cantidad de personas cuando mis planes cambien.

## Descripción

Si cambia fecha, hora o cantidad de personas se vuelve a validar la disponibilidad y, si la mesa actual ya no sirve, se reasigna otra.

## Reglas de negocio

- **RN-052** Solo pueden modificarse reservas existentes
- **RN-053** No pueden asignarse fechas u horas pasadas
- **RN-054** La cantidad de personas debe ser mayor que cero
- **RN-055** Si cambia fecha, hora o personas, se valida nuevamente la disponibilidad
- **RN-056** Si la mesa actual no cumple la nueva capacidad, se asigna otra mesa
- **RN-057** No se permite modificar reservas en `CANCELLED`, `NO_SHOW` o `COMPLETED`
- **RN-058** La modificación no debe generar conflictos con otras reservas

## Endpoint

```http
PATCH /api/v1/reservations/{id}
```

## Criterios de aceptación

- [ ] Se puede modificar una reserva existente
- [ ] Se pueden cambiar fecha, hora y cantidad de personas
- [ ] La disponibilidad se valida nuevamente cuando corresponde
- [ ] La mesa se reasigna si la actual ya no es adecuada
- [ ] No se generan conflictos con otras reservas
- [ ] No se pueden modificar reservas canceladas, no presentadas o completadas
- [ ] Los cambios quedan almacenados correctamente en PostgreSQL

## Rama sugerida

`feat/HU-009-update-reservation`  ·  **scope de commits:** `reservations`
'@

# ---------------------------- HU-010 -------------------------
New-HU -Title "HU-010 - Cancelación de Reserva" `
  -Milestone "Sprint 2" `
  -Labels "user story,epic: reservations,priority: very high,points: 8" `
  -Body @'
**Épica:** Gestión de Reservas · **Story Points:** 8 · **Prioridad:** Muy Alta · **Dependencias:** HU-007, HU-008

## Historia de usuario

**Como** cliente del restaurante
**Quiero** cancelar una reserva existente
**Para** liberar la mesa cuando ya no pueda asistir al restaurante.

## Descripción

Al cancelar, el estado pasa a `CANCELLED`, la mesa vuelve a estar disponible en ese horario, la reserva se conserva en el historial y se registra la fecha de cancelación.

## Reglas de negocio

- **RN-059** Solo pueden cancelarse reservas existentes
- **RN-060** No se puede cancelar una reserva ya `CANCELLED`
- **RN-061** No se puede cancelar una reserva en `CHECKED_IN` o `COMPLETED`
- **RN-062** La cancelación conserva la reserva para efectos históricos
- **RN-063** Una reserva cancelada deja de bloquear la disponibilidad de la mesa
- **RN-064** La fecha y hora de cancelación quedan registradas

## Endpoint

```http
PATCH /api/v1/reservations/{id}/cancel
```

## Criterios de aceptación

- [ ] Se puede cancelar una reserva válida
- [ ] La reserva cambia a estado `CANCELLED`
- [ ] La reserva permanece disponible para consulta histórica
- [ ] La mesa vuelve a estar disponible para nuevas reservas
- [ ] No se pueden cancelar reservas ya canceladas
- [ ] No se pueden cancelar reservas con check-in realizado o completadas
- [ ] La fecha de cancelación queda almacenada correctamente

## Rama sugerida

`feat/HU-010-cancel-reservation`  ·  **scope de commits:** `reservations`
'@

# -------------------------------------------------------------
Write-Host "`n== Listo ==" -ForegroundColor Green
Write-Host "Se crearon 14 labels, 2 milestones y 10 issues en $repo`n"
Write-Host "Siguiente paso (manual, 2 minutos):" -ForegroundColor Yellow
Write-Host "  1. En el repo -> pestana Projects -> New project -> plantilla Board"
Write-Host "  2. Nombralo 'Restaurante - Backlog' y crea las columnas:"
Write-Host "     Backlog | Todo | In Progress | In Review | Done"
Write-Host "  3. Boton '+ Add item' -> escribe # -> selecciona las 10 issues"
Write-Host "  4. Deja HU-001 a HU-005 en Todo y HU-006 a HU-010 en Backlog`n"
