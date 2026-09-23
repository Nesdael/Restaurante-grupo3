# HU-004 — Products Management

**Author:** Jaime David Villanova Lamar

---

## Overview

Implemented the product management functionality for the restaurant API.

Products belong to a `Category` (reused from **HU-003**) and expose a `status` (active/inactive) and an `availability` (available/unavailable) that are managed independently of each other and independently of the general update endpoint.

The implementation allows creating a product, listing all products, retrieving a single product, updating its general data, and changing its status or availability through dedicated endpoints.

---

## Endpoints

| Method    | Path                          | Description                          |
| :-------- | :---------------------------- | :------------------------------------ |
| **POST**  | `/products`                   | Create a new product                 |
| **GET**   | `/products`                   | List every product                   |
| **GET**   | `/products/{id}`              | Get a single product                 |
| **PATCH** | `/products/{id}`              | Update a product's general data      |
| **PATCH** | `/products/{id}/status`       | Activate or deactivate a product     |
| **PATCH** | `/products/{id}/availability` | Change the availability of a product |

---

## Business Rules

### RN-025 — Product must belong to an existing category

Every product must reference an existing category through `categoryId`. Before creating or reassigning a product's category, the service checks that the category exists:

```typescript
private async ensureCategoryExists(categoryId: string): Promise<void> {
  const category = await this.categoriesRepository.findOneBy({ id: categoryId });

  if (!category) {
    throw new NotFoundException(`Category with id ${categoryId} not found`);
  }
}
```

If the category does not exist, the API returns `404 Not Found`. This rule is enforced both on **creation** and when the `categoryId` is changed through the general **update**.

### RN-026 — Price must be greater than zero

The price is validated at the DTO level and enforced at the database level:

```typescript
@IsNumber({ maxDecimalPlaces: 2 })
@IsPositive()
price: number;
```

```typescript
@Check('"price" > 0')
```

A product with a price of zero or less is rejected with a `400 Bad Request` before it ever reaches the database.

### RN-027 — New products are ACTIVE by default

```typescript
@Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
status: ProductStatus;
```

A newly created product does not need to specify a status; it is set to `ACTIVE` automatically.

### RN-028 — New products are AVAILABLE by default

```typescript
@Column({
  type: 'enum',
  enum: ProductAvailability,
  default: ProductAvailability.AVAILABLE,
})
availability: ProductAvailability;
```

A newly created product does not need to specify an availability; it is set to `AVAILABLE` automatically.

### Status and availability are updated independently

`status` and `availability` are intentionally excluded from the general `UpdateProductDto`:

```typescript
// status and availability are not editable here: they have their own
// endpoints (PATCH /products/:id/status and /products/:id/availability).
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

Each has its own endpoint and DTO (`UpdateProductStatusDto`, `UpdateProductAvailabilityDto`), keeping the general update focused on descriptive fields (`name`, `description`, `price`, `categoryId`).

---

## Product Fields

- `id`
- `name`
- `description` *(optional)*
- `price`
- `status`
- `availability`
- `categoryId`
- `category` *(relation, loaded via `ManyToOne`)*

---

## Endpoint Details

### Create Product

- **Endpoint:** `POST /products`
- Validates the payload with `CreateProductDto`.
- Checks that the referenced category exists (RN-025); otherwise returns `404 Not Found`.
- Sets `status = ACTIVE` and `availability = AVAILABLE` by default (RN-027, RN-028).
- Invalid payloads return `400 Bad Request`.

### List Products

- **Endpoint:** `GET /products`
- Returns every product, regardless of status or availability.

### Product Detail

- **Endpoint:** `GET /products/{id}`
- The product ID is validated as a UUID using `ParseUUIDPipe`.
- If the product does not exist, the API returns `404 Not Found`.

### Update Product

- **Endpoint:** `PATCH /products/{id}`
- Updates general fields (`name`, `description`, `price`, `categoryId`).
- If `categoryId` is included, the new category must exist (RN-025); otherwise `404 Not Found`.
- If the product itself does not exist, returns `404 Not Found`.

### Update Status

- **Endpoint:** `PATCH /products/{id}/status`
- Dedicated endpoint to activate or deactivate a product.
- If the product does not exist, returns `404 Not Found`.

### Update Availability

- **Endpoint:** `PATCH /products/{id}/availability`
- Dedicated endpoint to change a product's availability.
- If the product does not exist, returns `404 Not Found`.

---

## Validation and Error Handling

The products controller uses NestJS validation and HTTP exceptions.

- **Invalid UUID:** the product ID is validated using `ParseUUIDPipe`. An invalid UUID results in `400 Bad Request`.
- **Invalid payload:** `class-validator` decorators on the DTOs (`IsString`, `IsNumber`, `IsPositive`, `IsUUID`, `IsEnum`, etc.) return `400 Bad Request` on invalid input.
- **Product not found:** thrown as `404 Not Found` from `findOne`, `update`, `updateStatus`, and `updateAvailability`.
- **Category not found:** thrown as `404 Not Found` when creating a product or reassigning its category to one that doesn't exist.

---

## Swagger Documentation

The products controller includes Swagger/OpenAPI decorators for every endpoint. The following information is documented:

- Endpoint descriptions (`@ApiOperation`).
- Successful responses (`@ApiCreatedResponse`, `@ApiOkResponse`).
- Not found responses (`@ApiNotFoundResponse`).
- Bad request responses (`@ApiBadRequestResponse`).
- Products API tag (`@ApiTags('Products')`).

Swagger can be accessed through: `http://localhost:3000/api/docs`

---

## Module Structure & Dependencies

### Directory Layout

```text
products/
├── dto/
│   ├── create-product.dto.ts
│   ├── update-product.dto.ts
│   ├── update-product-status.dto.ts
│   └── update-product-availability.dto.ts
├── entities/
│   └── product.entity.ts
├── enums/
│   ├── product-status.enum.ts
│   └── product-availability.enum.ts
├── docs/
│   └── products.info.md
├── products.controller.spec.ts
├── products.controller.ts
├── products.module.ts
├── products.service.spec.ts
└── products.service.ts
```

### Dependencies

```typescript
TypeOrmModule.forFeature([Product, Category]);
```

- **ProductsController:** Handles HTTP requests.
- **ProductsService:** Contains the product business logic and category validation.
- **Product:** New entity introduced in HU-004.
- **Category:** Reused from HU-003 to validate `categoryId`.

The module exports `ProductsService` and `TypeOrmModule` so other modules (such as `menu`, HU-005) can inject the service or the `Product` repository directly:

```typescript
exports: [ProductsService, TypeOrmModule],
```

---

## Architecture

The implementation follows the project's existing NestJS architecture:

```text
HTTP Request ──> ProductsController ──> ProductsService ──> TypeORM Repository ──> PostgreSQL
```

The controller is responsible for receiving requests and parameters, while the service handles the product business rules, category validation, and database queries.

---

## Unit Tests

The module is covered by **13 unit tests** across two spec files, run with Vitest.

### `products.service.spec.ts` (6 tests)

| # | Test | Covers |
| :- | :--- | :----- |
| 1 | Creates a product with `ACTIVE` status and `AVAILABLE` availability by default | RN-027, RN-028 |
| 2 | Rejects a product whose category does not exist | RN-025 |
| 3 | Throws `NotFoundException` when a product is not found | `findOne` |
| 4 | Changes the status of an existing product | `updateStatus` |
| 5 | Changes the availability of an existing product | `updateAvailability` |
| 6 | Rejects an update that moves the product to a category that does not exist | RN-025 |

### `products.controller.spec.ts` (7 tests)

| # | Test | Covers |
| :- | :--- | :----- |
| 1 | Controller is defined | Module wiring |
| 2 | Creates a product | `POST /products` |
| 3 | Lists products | `GET /products` |
| 4 | Returns a single product | `GET /products/:id` |
| 5 | Updates a product | `PATCH /products/:id` |
| 6 | Updates only the status | `PATCH /products/:id/status` |
| 7 | Updates only the availability | `PATCH /products/:id/availability` |

### Running the tests

```bash
npm test -- src/modules/products
```

**Result:**

```text
✓ src/modules/products/products.service.spec.ts (6 tests)
✓ src/modules/products/products.controller.spec.ts (7 tests)

Test Files  2 passed (2)
     Tests  13 passed (13)
```

---

## Result

**HU-004** provides a product management API that allows administration to:

- Create products tied to an existing category, with sensible defaults (`ACTIVE` / `AVAILABLE`).
- List and retrieve products.
- Update a product's general data, including reassigning its category.
- Change a product's status and availability through dedicated, independent endpoints.

The implementation satisfies the HU-004 business rules **RN-025** through **RN-028**, and lays the groundwork reused later by **HU-005** (public menu).