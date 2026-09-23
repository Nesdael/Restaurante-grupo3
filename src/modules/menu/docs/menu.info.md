# HU-005 — Menu Query

**Author:** Kevin Mercado

---

## Overview

Implemented the public menu query functionality for the restaurant API.

The menu is read-only and reuses the existing `Category` and `Product` entities from **HU-003** and **HU-004**. No new database entities were created for the menu.

The implementation allows customers to browse active categories and active products, view products grouped by category, query products from a specific category, and view the details of an individual product. Unavailable products remain visible and expose their current availability status.

---

## Endpoints

| Method  | Path                                            | Description                                 |
| :------ | :---------------------------------------------- | :------------------------------------------ |
| **GET** | `/api/v1/menu`                                  | Get the full menu grouped by category       |
| **GET** | `/api/v1/menu/categories`                       | Get all active categories                   |
| **GET** | `/api/v1/menu/categories/{categoryId}/products` | Get active products from an active category |
| **GET** | `/api/v1/menu/products/{id}`                    | Get an active product with its category     |

---

## Business Rules

### RN-031 — Active categories only

Only categories with status `ACTIVE` are included in the public menu. The category query uses:

```typescript
where: {
  status: CategoryStatus.ACTIVE;
}
```

Inactive categories are therefore excluded from the public menu.

### RN-032 — Active products only

Only products with status `ACTIVE` are returned. The product queries apply:

```typescript
status: ProductStatus.ACTIVE;
```

This rule is applied to the full menu, category-specific queries, and individual product queries.

### RN-033 — Unavailable products

Products with availability `UNAVAILABLE` are not removed from the menu automatically. Their availability field is included in the public response so the client can identify that the product is currently unavailable.

The public product fields include:

```json
"availability": true
```

This allows the frontend to display the product as unavailable and prevent it from being selected.

### RN-034 — Products grouped by category

The full menu groups products under their corresponding active category. The service first retrieves active categories and then retrieves active products belonging to those categories.

The final response is mapped into the following structure:

```text
Category
 ├── id
 ├── name
 └── products
      ├── Product
      ├── Product
      └── ...
```

- Products are ordered **alphabetically by name**.
- Categories are also ordered **alphabetically by name**.

### RN-035 — Availability changes are reflected

The menu reads the current category and product information directly from the database. Therefore, when administration changes a product's availability, the next menu query reflects the updated value.

**Flow Example:**

```text
AVAILABLE
   ↓
Administration changes availability
   ↓
UNAVAILABLE
   ↓
GET /api/v1/menu
   ↓
Product is returned with availability = UNAVAILABLE
```

---

## Availability Filter

An optional availability query parameter was implemented through `MenuQueryDto`.

**Examples:**

- Full Menu: `GET /api/v1/menu?availability=AVAILABLE`
- Category Products: `GET /api/v1/menu/categories/{categoryId}/products?availability=AVAILABLE`

The supported values are defined by the `ProductAvailability` enum. The parameter is optional and is validated using `class-validator`:

```typescript
@IsOptional()
@IsEnum(ProductAvailability)
availability?: ProductAvailability;
```

Swagger documentation is also provided through `@ApiPropertyOptional()`.

---

## Public Product Fields

The menu does not expose the product status because the public menu only returns active products.

**Exposed Fields:**

- `id`
- `name`
- `description`
- `price`
- `availability`
- `categoryId`

For the **individual product endpoint**, the category information is also included:

```text
category
 ├── id
 └── name
```

---

## Endpoint Details

### Category Query

- **Endpoint:** `GET /api/v1/menu/categories`
- Returns only active categories.
- Categories are returned with `id` and `name`.
- Ordered **alphabetically by name**.

### Products by Category

- **Endpoint:** `GET /api/v1/menu/categories/{categoryId}/products`
- Only accepts an active category.
- If the category does not exist or is inactive, the API returns a `404 Not Found` response.
- The category ID is validated as a UUID using `ParseUUIDPipe`.
- Only active products belonging to the requested category are returned.

### Product Detail

- **Endpoint:** `GET /api/v1/menu/products/{id}`
- Returns the details of an active product that belongs to an active category.
- The product ID is validated as a UUID.
- If the product does not exist, is inactive, or belongs to an inactive category, the API returns `404 Not Found`.
- The response includes the product's category information.

---

## Validation and Error Handling

The menu controller uses NestJS validation and HTTP exceptions.

- **Invalid UUID:** Category and product IDs are validated using `ParseUUIDPipe`. An invalid UUID results in a `400 Bad Request`.
- **Category not found:** When requesting products from a category that does not exist or is inactive, it throws a `404 Not Found`.
- **Product not found:** When requesting a product that does not exist, is inactive, or belongs to an inactive category, it throws a `404 Not Found`.

---

## Swagger Documentation

The menu controller includes Swagger/OpenAPI decorators for the public endpoints. The following information is documented:

- Endpoint descriptions.
- Successful responses.
- Bad request responses.
- Not found responses.
- Optional availability filtering.
- Menu API tag.

Swagger can be accessed through: `http://localhost:3000/api/docs`

---

## Module Structure & Dependencies

### Directory Layout

```text
menu/
├── dto/
│   └── menu-query.dto.ts
├── menu.controller.spec.ts
├── menu.controller.ts
├── menu.module.ts
├── menu.service.spec.ts
└── menu.service.ts
```

### Dependencies

The menu module reuses the existing entities instead of creating duplicate menu entities:

```typescript
TypeOrmModule.forFeature([Category, Product]);
```

- **MenuController:** Handles HTTP requests.
- **MenuService:** Contains the menu business logic.
- **MenuQueryDto:** Validates optional query parameters.
- **Category:** Reused from HU-003.
- **Product:** Reused from HU-004.

---

## Architecture

The implementation follows the project's existing NestJS architecture:

```text
HTTP Request ──> MenuController ──> MenuService ──> TypeORM Repository ──> PostgreSQL
```

The controller is responsible for receiving requests and parameters, while the service handles the menu business rules and database queries.

---

## Result

**HU-005** provides a public read-only menu API that allows customers to:

- Browse the complete menu.
- View only active categories and active products.
- Browse products grouped by category (ordered alphabetically).
- Identify unavailable products and filter products by availability.
- Query a specific active category and view individual active products with their category information.
- See the current availability state instantly after administrative changes.

The implementation satisfies the HU-005 business rules **RN-031** through **RN-035** while reusing the existing category and product functionality from HU-003 and HU-004.
