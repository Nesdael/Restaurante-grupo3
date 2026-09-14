# Guía de contribución

Todo lo que se escribe en Git va **en inglés**: nombres de ramas, mensajes de commit, títulos y descripciones de Pull Request. El código también en inglés. Los comentarios y las conversaciones del equipo pueden ir en español.

---

## 1. Ramas

| Rama | Propósito |
|---|---|
| `main` | Versión estable y entregable. Solo recibe merges desde `develop`. |
| `develop` | Rama de integración. Aquí llegan todos los Pull Requests. |
| `feat/HU-XXX-<short-description>` | Nueva funcionalidad. |
| `fix/HU-XXX-<short-description>` | Corrección de un error. |
| `chore/<short-description>` | Configuración, dependencias o mantenimiento sin historia asociada. |

Reglas:

- Todo en **inglés**, minúsculas y separado con guiones.
- El código de la historia (`HU-001` … `HU-010`) va siempre en la rama de trabajo.
- Cada rama sale de `develop` y vuelve a `develop` por Pull Request.
- Nadie hace push directo a `main` ni a `develop`.

Ejemplos:

```
feat/HU-002-table-management
feat/HU-005-menu-query
fix/HU-004-product-price-validation
chore/setup-eslint-prettier
```

---

## 2. Mensajes de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <description>
```

- `type` → qué clase de cambio es.
- `scope` → el módulo que tocaste (ver tabla abajo).
- `description` → en **inglés**, minúscula, en imperativo y sin punto final. Máximo 72 caracteres.

### Tipos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un error |
| `docs` | Documentación (README, Swagger, esta guía) |
| `style` | Formato, indentación, imports (sin cambiar lógica) |
| `refactor` | Reorganizar código sin cambiar su comportamiento |
| `test` | Agregar o modificar pruebas |
| `chore` | Configuración, dependencias, Docker, scripts |

### Scopes

Salen de los módulos del proyecto. Usa siempre el mismo nombre:

| Scope | Corresponde a |
|---|---|
| `config` | `@nestjs/config`, variables de entorno, `main.ts` |
| `prisma` | `schema.prisma`, migraciones, `PrismaService` |
| `docker` | `Dockerfile`, `docker-compose.yml` |
| `health` | Health check |
| `tables` | Mesas (HU-002) |
| `categories` | Categorías del menú (HU-003) |
| `products` | Productos del menú (HU-004) |
| `menu` | Menú público (HU-005) |
| `reservations` | Reservas (HU-006 … HU-010) |
| `common` | Filters, guards, pipes, interceptors compartidos |
| `docs` | Documentación del repositorio |

Si el cambio no encaja en ningún módulo, se puede omitir el scope: `chore: update dependencies`.

### Ejemplos

```
feat(tables): add table registration endpoint
feat(reservations): validate availability before creating a reservation
fix(products): reject prices lower than or equal to zero
refactor(menu): move menu building logic to the service
test(categories): add unit tests for unique name validation
docs(readme): document required environment variables
chore(docker): add postgres service to docker compose
```

### Referencia a la historia y al issue

El cuerpo del commit lleva la historia de usuario y, si aplica, el issue:

```
feat(tables): add table registration endpoint

Implements HU-002 (RN-016, RN-017, RN-018).
Refs #12
```

> El `Closes #<número>` se escribe en la descripción del **Pull Request**, no en cada commit. Así el issue se cierra una sola vez, al hacer merge.

### Qué no hacer

```
❌ cambios
❌ avance del día
❌ Feat: Agregué el endpoint de mesas.
❌ feat(tables): added table registration endpoint   (pasado, no imperativo)
✅ feat(tables): add table registration endpoint
```

Commits pequeños y con un solo propósito. Si el mensaje necesita un "y", probablemente son dos commits.

---

## 3. Flujo de trabajo

1. Toma un issue del tablero, asígnatelo y muévelo a **In Progress**.
2. Actualiza tu `develop` local:
   ```bash
   git checkout develop
   git pull origin develop
   ```
3. Crea tu rama desde `develop`:
   ```bash
   git checkout -b feat/HU-002-table-management
   ```
4. Haz commits pequeños siguiendo la convención de arriba.
5. Antes de abrir el PR, trae los últimos cambios de `develop` y resuelve conflictos:
   ```bash
   git pull origin develop
   ```
6. Verifica que todo pasa:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
7. Sube tu rama y abre un Pull Request hacia `develop` usando la plantilla.
8. El PR necesita al menos **1 aprobación** para hacer merge.
9. Después del merge, borra la rama y mueve el issue a **Done**.

---

## 4. Pull Requests

- El **título del PR** sigue el mismo formato de los commits, en inglés:
  ```
  feat(tables): add table management module
  ```
- En la descripción va `Closes #<número>` para que el issue se cierre solo al hacer merge.
- Un PR = una historia de usuario (o una corrección puntual). No mezclar historias.
- Quien revisa deja comentarios concretos; quien abrió el PR los resuelve antes del merge.
- Nadie aprueba su propio PR.

---

## 5. Nomenclatura de código

**TypeScript / NestJS**

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase` | `findAvailableTables`, `currentReservation` |
| Clases | `PascalCase` | `TablesService`, `CreateTableDto` |
| Interfaces y tipos | `PascalCase` | `ReservationSlot` |
| Enums y sus valores | `PascalCase` / `UPPER_SNAKE_CASE` | `TableStatus.OUT_OF_SERVICE` |
| Constantes globales | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Archivos | `kebab-case` con sufijo Nest | `tables.controller.ts`, `create-table.dto.ts` |
| Carpetas de módulo | `kebab-case`, en plural | `src/modules/reservations/` |

**Base de datos (PostgreSQL vía Prisma)**

| Elemento | Convención | Ejemplo |
|---|---|---|
| Modelos de Prisma | `PascalCase` singular | `Table`, `OrderItem` |
| Tablas | `snake_case` plural | `tables`, `order_items` |
| Columnas | `snake_case` | `table_number`, `created_at` |
| Migraciones | `snake_case` en inglés | `npx prisma migrate dev --name add_tables_table` |

---

## 6. Convenciones técnicas del proyecto

Salen de las reglas de negocio RN-003 a RN-013 del HU-001:

- Todos los endpoints van bajo el prefijo `/api/v1`.
- Cada dominio funcional vive en su propio módulo dentro de `src/modules/`.
- Los controladores solo reciben la solicitud y delegan; la lógica de negocio vive en los servicios.
- El acceso a la base de datos se hace únicamente a través de `PrismaService`.
- El esquema se modifica editando `prisma/schema.prisma` y creando una migración versionada; nunca con SQL manual.
- Los datos de entrada se validan con DTOs y `class-validator`.
- Ningún secreto, contraseña o credencial se escribe en el código fuente.

---

## 7. Definición de Hecho (DoD)

Una historia está terminada solo si:

- [ ] El proyecto compila sin errores.
- [ ] `npm run lint` pasa sin errores y el código está formateado con Prettier.
- [ ] Los datos de entrada se validan mediante DTOs con `class-validator`.
- [ ] La lógica de negocio está en servicios, no en controladores.
- [ ] Todo cambio en la base de datos tiene su migración de Prisma versionada.
- [ ] Los endpoints nuevos están documentados en Swagger.
- [ ] La lógica nueva tiene pruebas y `npm run test` pasa.
- [ ] Se cumplen todos los criterios de aceptación de la historia de usuario.
- [ ] El README y el `.env.example` están actualizados si el cambio lo requiere.
- [ ] El PR fue revisado, aprobado y mergeado en `develop`.
- [ ] El issue se movió a **Done** en el tablero.
