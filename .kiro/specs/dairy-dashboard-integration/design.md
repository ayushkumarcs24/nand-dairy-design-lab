# Design Document: Dairy Dashboard Integration

## Overview

This design document specifies the implementation of functional dashboard interactions for the Nand Dairy Management System. The system is built using React with TypeScript on the frontend, Express.js on the backend, and Prisma with SQLite for data persistence. The application follows a role-based architecture where each user type (Owner, Samiti, Farmer, Distributor, Logistics) has dedicated dashboards with specific capabilities.

The design maintains existing UI layouts while implementing complete CRUD operations, business logic enforcement (such as the distributor credit blocking rule), and real-time data synchronization across all dashboards. The architecture emphasizes separation of concerns with clear boundaries between presentation, business logic, and data access layers.

## Architecture

### System Architecture

The application follows a three-tier architecture:

1. **Presentation Layer (React Frontend)**
   - Role-specific dashboard components
   - Shared UI components from shadcn/ui
   - React Query for state management and caching
   - React Router for navigation

2. **Application Layer (Express Backend)**
   - RESTful API endpoints organized by role
   - JWT-based authentication with HTTP-only cookies
   - Business logic enforcement
   - Request validation and error handling

3. **Data Layer (Prisma + SQLite)**
   - Prisma ORM for type-safe database access
   - SQLite database (production can use PostgreSQL/MySQL)
   - Database migrations for schema evolution
   - Referential integrity enforcement

### Authentication Flow

```
User → Role-specific Login Page → Backend Auth Endpoint → JWT Token → HTTP-only Cookie → Dashboard
```

Authentication is handled via JWT tokens stored in HTTP-only cookies to prevent XSS attacks. Each login endpoint validates that the user's role matches the expected role for that login page.

### Data Flow Pattern

```
User Action → React Component → React Query Mutation → API Call → Express Route → 
Business Logic → Prisma Query → Database → Response → React Query Cache Update → UI Update
```

## Components and Interfaces

### Frontend Components Structure

#### Owner Dashboard Components
- `OwnerDashboard`: Main dashboard with summary statistics
- `SamitiManagement`: CRUD operations for samitis
- `DistributorManagement`: CRUD operations for distributors
- `ProductManagement`: CRUD operations for products
- `VehicleManagement`: CRUD operations for vehicles
- `SamitiInvoiceManagement`: View and process samiti invoices
- `OwnerSettings`: System configuration

#### Samiti Dashboard Components
- `SamitiDashboard`: Main dashboard with collection statistics
- `MilkCollectionForm`: Record milk collections from farmers
- `MilkCollectionList`: View and filter collections
- `InvoiceGenerator`: Generate invoices for periods
- `InvoiceList`: View invoice status
- `FarmerPayoutManager`: Create and process farmer payouts
- `PayoutList`: View payout history

#### Farmer Dashboard Components
- `FarmerDashboard`: Main dashboard with earnings summary
- `CollectionHistory`: View milk collection records
- `PaymentHistory`: View payout records
- `DailySummary`: Aggregate daily collections
- `MonthlySummary`: Aggregate monthly collections
- `AccountSummary`: Total earned vs received

#### Distributor Dashboard Components
- `DistributorDashboard`: Main dashboard with order statistics
- `ProductCatalog`: Browse and select products
- `OrderForm`: Create new orders
- `OrderHistory`: View order records
- `OrderDetails`: View individual order breakdown
- `PaymentForm`: Record payments for orders
- `DuePayments`: View outstanding balances

#### Logistics Dashboard Components
- `LogisticsDashboard`: Main dashboard with fleet statistics
- `PendingOrders`: View unassigned orders
- `VehicleList`: View vehicle capacity and utilization
- `OrderAssignment`: Assign orders to vehicles
- `AssignmentHistory`: View past assignments
- `VehicleUtilization`: Monitor fleet efficiency

### Backend API Structure

#### Authentication Endpoints (`/api/auth`)
- `POST /login` - Authenticate user with role validation
- `POST /logout` - Clear authentication session
- `GET /me` - Get current authenticated user

#### Owner Endpoints (`/api/owner`)
- `GET /dashboard-summary` - Get dashboard statistics
- `GET /samitis` - List all samitis
- `POST /samitis` - Create new samiti
- `PUT /samitis/:id` - Update samiti
- `DELETE /samitis/:id` - Delete samiti
- `GET /distributors` - List all distributors
- `POST /distributors` - Create new distributor
- `PUT /distributors/:id` - Update distributor
- `DELETE /distributors/:id` - Delete distributor
- `GET /products` - List all products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /vehicles` - List all vehicles
- `POST /vehicles` - Create new vehicle
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle
- `GET /samiti-invoices` - List all samiti invoices
- `GET /samiti-invoices/:id` - Get invoice details
- `PUT /samiti-invoices/:id/pay` - Mark invoice as paid

#### Samiti Endpoints (`/api/samiti`)
- `GET /dashboard-summary` - Get dashboard statistics
- `GET /farmers` - List farmers in samiti
- `GET /milk-collections` - List milk collections
- `POST /milk-collections` - Create milk collection
- `PUT /milk-collections/:id` - Update milk collection
- `DELETE /milk-collections/:id` - Delete milk collection
- `POST /invoices/generate` - Generate invoice for period
- `GET /invoices` - List samiti invoices
- `GET /invoices/:id` - Get invoice details
- `POST /payouts` - Create farmer payout
- `GET /payouts` - List farmer payouts
- `PUT /payouts/:id/pay` - Mark payout as paid

#### Farmer Endpoints (`/api/farmer`)
- `GET /dashboard-summary` - Get dashboard statistics
- `GET /collections` - List milk collections
- `GET /collections/daily` - Get daily summary
- `GET /collections/monthly` - Get monthly summary
- `GET /payouts` - List payouts
- `GET /payouts/:id` - Get payout details
- `GET /account-summary` - Get total earned vs received

#### Distributor Endpoints (`/api/distributor`)
- `GET /dashboard-summary` - Get dashboard statistics
- `GET /products` - List available products
- `POST /orders` - Create new order (with blocking check)
- `GET /orders` - List orders
- `GET /orders/:id` - Get order details
- `POST /payments` - Record payment
- `GET /payments` - List payments
- `GET /due-payments` - List orders with outstanding dues
- `GET /credit-status` - Check if blocked

#### Logistics Endpoints (`/api/logistics`)
- `GET /dashboard-summary` - Get dashboard statistics
- `GET /pending-orders` - List unassigned orders
- `GET /vehicles` - List vehicles with capacity
- `GET /vehicles/:id` - Get vehicle details
- `POST /assignments` - Assign order to vehicle
- `DELETE /assignments/:id` - Unassign order
- `GET /assignments` - List all assignments
- `GET /utilization` - Get fleet utilization statistics

## Data Models

### Core Entities

The system uses the existing Prisma schema with the following key models:

#### User
```typescript
{
  id: number
  email: string
  passwordHash: string
  name: string
  role: "OWNER" | "SAMITI" | "FARMER" | "DISTRIBUTOR" | "LOGISTICS"
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Samiti
```typescript
{
  id: number
  name: string
  code: string
  location: string
  userId: number  // FK to User
  ownerId: number // FK to OwnerAdmin
}
```

#### Farmer
```typescript
{
  id: number
  farmerCode: string
  userId: number   // FK to User
  samitiId: number // FK to Samiti
}
```

#### MilkEntry (MilkCollection)
```typescript
{
  id: number
  date: DateTime
  session: "MORNING" | "EVENING"
  quantityLitre: number
  fat: number
  snf: number
  pricePerLitre: number
  totalAmount: number
  farmerId: number  // FK to Farmer
  samitiId: number  // FK to Samiti
  fatSnfValueId: number | null // FK to FatSnfValue
}
```

#### Product
```typescript
{
  id: number
  name: string
  description: string | null
  price: number
  unit: string
  inventory: number
  isActive: boolean
  ownerId: number // FK to OwnerAdmin
}
```

#### DistributorOrder (Order)
```typescript
{
  id: number
  createdAt: DateTime
  updatedAt: DateTime
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED"
  quantity: number
  totalAmount: number
  distributorId: number // FK to User
  productId: number     // FK to Product
}
```

#### LogisticsVehicle (Vehicle)
```typescript
{
  id: number
  vehicleCode: string
  plateNumber: string
  capacityLitre: number
  driverName: string
  isActive: boolean
}
```

### Extended Models Needed

To fully implement the requirements, we need to extend the schema with additional models:

#### SamitiInvoice
```typescript
{
  id: number
  samitiId: number
  periodStart: DateTime
  periodEnd: DateTime
  totalQuantityLitres: number
  totalAmount: number
  status: "PENDING" | "PAID"
  paidOn: DateTime | null
  createdAt: DateTime
}
```

#### FarmerPayout
```typescript
{
  id: number
  farmerId: number
  samitiId: number
  periodStart: DateTime
  periodEnd: DateTime
  totalQuantityLitres: number
  grossAmount: number
  deductions: number
  netAmount: number
  status: "PENDING" | "PAID"
  paidOn: DateTime | null
  createdAt: DateTime
}
```

#### OrderItem
```typescript
{
  id: number
  orderId: number      // FK to DistributorOrder
  productId: number    // FK to Product
  quantity: number
  unitPrice: number
  subtotal: number
}
```

#### Payment
```typescript
{
  id: number
  orderId: number      // FK to DistributorOrder
  amount: number
  paidOn: DateTime
  createdAt: DateTime
}
```

#### VehicleAssignment
```typescript
{
  id: number
  vehicleId: number    // FK to LogisticsVehicle
  orderId: number      // FK to DistributorOrder
  assignedDate: DateTime
  plannedWeightKg: number
  createdAt: DateTime
}
```

### Data Transfer Objects (DTOs)

#### CreateSamitiDTO
```typescript
{
  name: string
  code: string
  location: string
  contactName: string
  contactEmail: string
  contactPassword: string
}
```

#### CreateMilkCollectionDTO
```typescript
{
  farmerId: number
  date: string // ISO date
  session: "MORNING" | "EVENING"
  quantityLitre: number
  fat: number
  snf: number
}
```

#### CreateOrderDTO
```typescript
{
  items: Array<{
    productId: number
    quantity: number
  }>
}
```

#### CreatePaymentDTO
```typescript
{
  orderId: number
  amount: number
}
```

#### CreateVehicleAssignmentDTO
```typescript
{
  vehicleId: number
  orderId: number
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Owner Dashboard Properties

**Property 1: Samiti persistence**
*For any* valid samiti data submitted by the Owner, the system should persist the samiti record to the database and the samiti should appear in subsequent list queries.
**Validates: Requirements 1.2, 1.3**

**Property 2: Samiti update persistence**
*For any* existing samiti and any valid update data, the system should persist the changes and subsequent queries should reflect the updated values.
**Validates: Requirements 1.5**

**Property 3: Distributor creation completeness**
*For any* valid distributor data submitted by the Owner, the system should create both a distributor record and an associated user account, and both should be queryable.
**Validates: Requirements 2.2**

**Property 4: Distributor list completeness**
*For any* set of distributors in the system, the distributor list view should display all distributors with their aggregated order and due information.
**Validates: Requirements 2.3**

**Property 5: Blocked distributor indicator**
*For any* distributor with orders having due amounts greater than zero and due dates older than 2 days, the system should display a blocked status indicator.
**Validates: Requirements 2.5**

**Property 6: Product availability after creation**
*For any* valid product data submitted by the Owner, the system should persist the product and make it immediately available in the distributor product catalog.
**Validates: Requirements 3.2**

**Property 7: Product list completeness**
*For any* set of products in the system, the product list view should display all products with their details.
**Validates: Requirements 3.3**

**Property 8: Product update affects future orders only**
*For any* product price update, all orders created before the update should retain the old price, and all orders created after should use the new price.
**Validates: Requirements 3.4**

**Property 9: Product discontinuation preserves history**
*For any* product marked as discontinued, all historical order data referencing that product should remain unchanged and queryable.
**Validates: Requirements 3.5**

**Property 10: Vehicle availability after creation**
*For any* valid vehicle data submitted by the Owner, the system should persist the vehicle and make it immediately available for logistics assignments.
**Validates: Requirements 4.2**

**Property 11: Vehicle list completeness**
*For any* set of vehicles in the system, the vehicle list view should display all vehicles with their capacity and assignment status.
**Validates: Requirements 4.3**

**Property 12: Vehicle capacity constraint on update**
*For any* vehicle capacity update, if the new capacity is less than the current total assigned weight, the system should reject the update.
**Validates: Requirements 4.5**

**Property 13: Invoice list completeness**
*For any* set of samiti invoices in the system, the invoice list view should display all invoices with their details.
**Validates: Requirements 5.1**

**Property 14: Invoice payment effects**
*For any* samiti invoice marked as paid by the Owner, the system should update the invoice status, record the payment date, and enable the corresponding samiti to create farmer payouts for that period.
**Validates: Requirements 5.3**

**Property 15: Invoice filtering correctness**
*For any* status filter applied to invoices, the filtered list should contain only invoices matching that status and should contain all invoices with that status.
**Validates: Requirements 5.4**

**Property 16: Invoice search correctness**
*For any* search criteria (samiti name or date range), the search results should contain only invoices matching the criteria and should contain all matching invoices.
**Validates: Requirements 5.5**

### Samiti Dashboard Properties

**Property 17: Milk collection pricing calculation**
*For any* valid milk collection data with FAT and SNF values, the system should calculate the price per liter using the pricing formula, compute the total amount as price × quantity, and persist both values.
**Validates: Requirements 6.2, 19.1, 19.2**

**Property 18: Collection list completeness**
*For any* set of milk collections for a samiti, the collection list view should display all collections with their details.
**Validates: Requirements 6.3**

**Property 19: Collection filtering correctness**
*For any* filter criteria (date or session) applied to collections, the filtered list should contain only collections matching the criteria and should contain all matching collections.
**Validates: Requirements 6.4**

**Property 20: Farmer ownership validation**
*For any* farmer selected for a milk collection, if the farmer does not belong to the samiti, the system should reject the collection creation.
**Validates: Requirements 6.5**

**Property 21: Invoice generation aggregation**
*For any* period with accepted milk collections, the generated invoice should have total quantity equal to the sum of all collection quantities and total amount equal to the sum of all collection amounts for that period.
**Validates: Requirements 7.2**

**Property 22: Invoice list completeness for samiti**
*For any* set of invoices for a samiti, the invoice list view should display all invoices with their details.
**Validates: Requirements 7.3**

**Property 23: Paid invoice enables payouts**
*For any* invoice marked as paid, the samiti should be able to create farmer payouts for farmers who delivered milk during that invoice's period.
**Validates: Requirements 7.4**

**Property 24: Payout calculation correctness**
*For any* farmer and period selected for payout, the gross amount should equal the sum of all that farmer's collection amounts for the period, and net amount should equal gross amount minus deductions.
**Validates: Requirements 8.2**

**Property 25: Payout persistence**
*For any* valid payout data submitted, the system should persist the payout record with status "PENDING".
**Validates: Requirements 8.3**

**Property 26: Payout payment effects**
*For any* payout marked as paid, the system should update the status to "PAID", record the payment date, and update the farmer's account balance.
**Validates: Requirements 8.4**

**Property 27: Unpaid invoice blocks payouts**
*For any* payout creation attempt, if the corresponding samiti invoice for that period is not paid, the system should prevent payout creation.
**Validates: Requirements 8.5**

### Farmer Dashboard Properties

**Property 28: Farmer collection history completeness**
*For any* farmer, the collection history view should display all milk collections for that farmer with their details.
**Validates: Requirements 9.1**

**Property 29: Farmer collection date filtering**
*For any* date range filter applied to farmer collections, the filtered list should contain only collections within that range and should contain all collections within that range.
**Validates: Requirements 9.2**

**Property 30: Collection display includes pricing**
*For any* milk collection displayed, the view should show FAT, SNF, calculated price per liter, and total amount.
**Validates: Requirements 9.3, 19.5**

**Property 31: Daily summary aggregation**
*For any* day selected, the daily summary should have total quantity equal to the sum of morning and evening collection quantities for that day, and total amount equal to the sum of collection amounts.
**Validates: Requirements 9.4**

**Property 32: Monthly summary aggregation**
*For any* month selected, the monthly summary should have total quantity equal to the sum of all collection quantities for that month, and total amount equal to the sum of collection amounts.
**Validates: Requirements 9.5**

**Property 33: Farmer payout history completeness**
*For any* farmer, the payment history view should display all payouts for that farmer with their details.
**Validates: Requirements 10.1**

**Property 34: Farmer account summary correctness**
*For any* farmer, the account summary should show total earned equal to the sum of all collection amounts, total received equal to the sum of all paid payout net amounts, and outstanding balance equal to total earned minus total received.
**Validates: Requirements 10.3**

**Property 35: Farmer payout filtering**
*For any* status filter applied to farmer payouts, the filtered list should contain only payouts matching that status and should contain all payouts with that status.
**Validates: Requirements 10.4**

**Property 36: Weekly summary aggregation**
*For any* week selected, the weekly summary should correctly aggregate all collections and payouts for that week.
**Validates: Requirements 10.5**

### Distributor Dashboard Properties

**Property 37: Order total calculation**
*For any* product selection with quantities, the system should calculate each item subtotal as product price × quantity, and total order amount as the sum of all subtotals.
**Validates: Requirements 11.2**

**Property 38: Order persistence with items**
*For any* valid order submitted, the system should persist the order with status "PENDING" and create order item records for each product in the order.
**Validates: Requirements 11.3**

**Property 39: Credit blocking rule enforcement**
*For any* distributor with orders having due amounts greater than zero and due dates older than 2 days, the system should prevent new order creation.
**Validates: Requirements 11.4, 20.1, 20.2**

**Property 40: Distributor order history completeness**
*For any* distributor, the order history view should display all orders for that distributor with their details.
**Validates: Requirements 12.1**

**Property 41: Distributor order filtering**
*For any* status filter applied to distributor orders, the filtered list should contain only orders matching that status and should contain all orders with that status.
**Validates: Requirements 12.3**

**Property 42: Distributor monthly summary**
*For any* month selected, the monthly summary should have total amount equal to the sum of all order amounts for that month, and outstanding dues equal to the sum of all due amounts.
**Validates: Requirements 12.4**

**Property 43: Due payments display**
*For any* distributor, the due payments view should display only orders with due amounts greater than zero, and should display all such orders.
**Validates: Requirements 12.5**

**Property 44: Payment amount validation**
*For any* payment submission, if the payment amount exceeds the order's due amount, the system should reject the payment.
**Validates: Requirements 13.2**

**Property 45: Payment processing effects**
*For any* valid payment submitted, the system should increase the order's paid amount by the payment amount, decrease the due amount by the payment amount, and update the payment status.
**Validates: Requirements 13.3**

**Property 46: Full payment status update**
*For any* order where a payment makes the due amount zero, the system should mark the order as fully paid and update the distributor's credit status.
**Validates: Requirements 13.4**

**Property 47: Credit unblocking on payment**
*For any* distributor with overdue payments, if payments clear all overdue amounts (no orders with due > 0 and due date > 2 days old), the system should unblock the distributor and enable new order placement.
**Validates: Requirements 13.5, 20.3, 20.5**

### Logistics Dashboard Properties

**Property 48: Pending orders display completeness**
*For any* set of orders with status "PENDING", the pending orders view should display all such orders with calculated total weights.
**Validates: Requirements 14.1**

**Property 49: Logistics order filtering**
*For any* filter criteria (date or distributor) applied to orders, the filtered list should contain only orders matching the criteria and should contain all matching orders.
**Validates: Requirements 14.3**

**Property 50: Order weight calculation**
*For any* order, the total weight should equal the sum of (product weight × quantity) for all order items.
**Validates: Requirements 14.4**

**Property 51: Order sorting by weight**
*For any* sort direction (ascending or descending) applied to orders, the orders should be displayed in the correct weight order.
**Validates: Requirements 14.5**

**Property 52: Vehicle capacity validation**
*For any* vehicle and order assignment attempt, if the order weight plus the vehicle's current load exceeds the vehicle's maximum capacity, the system should reject the assignment.
**Validates: Requirements 15.2**

**Property 53: Assignment creation effects**
*For any* valid vehicle assignment submitted, the system should create the assignment record, increase the vehicle's current load by the order weight, and change the order status to "DISPATCHED".
**Validates: Requirements 15.3**

**Property 54: Vehicle assignments display completeness**
*For any* set of vehicle assignments, the assignments view should display all assignments with their details.
**Validates: Requirements 15.5**

**Property 55: Vehicle list with utilization**
*For any* set of vehicles, the vehicle list view should display all vehicles with their utilization percentages calculated as (current load / maximum capacity) × 100.
**Validates: Requirements 16.1**

**Property 56: Vehicle utilization filtering**
*For any* utilization range filter applied to vehicles, the filtered list should contain only vehicles with utilization in that range and should contain all such vehicles.
**Validates: Requirements 16.3**

**Property 57: Daily logistics summary**
*For any* day selected, the daily summary should have total orders equal to the count of assignments for that day, and total weight equal to the sum of planned weights.
**Validates: Requirements 16.4**

**Property 58: Unassignment effects**
*For any* vehicle assignment deleted, the system should remove the assignment record, decrease the vehicle's current load by the order weight, and change the order status back to "PENDING".
**Validates: Requirements 16.5**

### Authentication and Navigation Properties

**Property 59: Role-matched authentication**
*For any* valid credentials submitted to a role-specific login page, if the user's role matches the login page role, authentication should succeed and create a session.
**Validates: Requirements 17.2**

**Property 60: Invalid credentials rejection**
*For any* invalid credentials submitted to any login page, authentication should fail and display an error message.
**Validates: Requirements 17.3**

**Property 61: Role mismatch prevention**
*For any* valid credentials submitted to a role-specific login page, if the user's role does not match the login page role, authentication should fail.
**Validates: Requirements 17.4**

**Property 62: Post-authentication redirect**
*For any* successful authentication, the system should redirect the user to the appropriate role-specific dashboard.
**Validates: Requirements 17.5**

**Property 63: Active navigation highlighting**
*For any* dashboard section being viewed, the corresponding navigation item should be highlighted as active.
**Validates: Requirements 18.2**

**Property 64: Unauthenticated access prevention**
*For any* attempt to access a protected dashboard section without authentication, the system should redirect to the login page.
**Validates: Requirements 18.3**

**Property 65: Logout session clearing**
*For any* logout action, the system should clear the authentication session and redirect to the login page.
**Validates: Requirements 18.4**

**Property 66: Session persistence on refresh**
*For any* authenticated user refreshing the page, the system should maintain the session and display the current section.
**Validates: Requirements 18.5**

### Data Validation Properties

**Property 67: FAT/SNF validation**
*For any* milk collection with FAT or SNF values outside valid ranges, the system should reject the collection and display an error message.
**Validates: Requirements 19.3**

**Property 68: Pricing formula immutability**
*For any* pricing formula update, all existing milk collection records should retain their original calculated prices, and only new collections should use the updated formula.
**Validates: Requirements 19.4**

**Property 69: Blocked distributor display**
*For any* distributor viewed by the Owner, if the distributor has orders with due amounts greater than zero and due dates older than 2 days, the system should display a blocked status.
**Validates: Requirements 20.4**

## Error Handling

### Error Categories

1. **Validation Errors**: Input data that fails business rule validation
   - Invalid FAT/SNF ranges
   - Payment amount exceeding due amount
   - Farmer not belonging to samiti
   - Vehicle capacity exceeded

2. **Authorization Errors**: Access attempts without proper permissions
   - Unauthenticated access to protected routes
   - Role mismatch on login
   - Cross-role data access attempts

3. **Business Logic Errors**: Operations that violate business rules
   - Distributor credit blocking
   - Payout creation before invoice payment
   - Invoice generation for empty periods
   - Product discontinuation with active orders

4. **Database Errors**: Data persistence failures
   - Unique constraint violations
   - Foreign key constraint violations
   - Connection failures
   - Transaction rollback scenarios

### Error Handling Strategy

#### Frontend Error Handling

All API calls use React Query which provides built-in error handling:

```typescript
const { mutate, error, isError } = useMutation({
  mutationFn: createOrder,
  onError: (error) => {
    toast.error(error.message);
  },
  onSuccess: () => {
    toast.success("Order created successfully");
    queryClient.invalidateQueries(['orders']);
  }
});
```

Error display patterns:
- **Toast notifications** for transient errors (network, validation)
- **Inline form errors** for field-specific validation
- **Error boundaries** for component-level failures
- **Fallback UI** for critical failures

#### Backend Error Handling

Express middleware for centralized error handling:

```typescript
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof AuthorizationError) {
    return res.status(403).json({ message: err.message });
  }
  if (err instanceof BusinessLogicError) {
    return res.status(422).json({ message: err.message });
  }
  // Log unexpected errors
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});
```

Error response format:
```typescript
{
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

### Specific Error Scenarios

#### Credit Blocking Error
When a distributor attempts to place an order while blocked:
```typescript
{
  message: "Cannot place order. You have overdue payments.",
  code: "CREDIT_BLOCKED",
  details: {
    overdueOrders: [
      { orderId: 123, dueAmount: 5000, dueDate: "2024-11-20" }
    ]
  }
}
```

#### Capacity Exceeded Error
When a logistics user attempts to assign an order exceeding vehicle capacity:
```typescript
{
  message: "Cannot assign order. Vehicle capacity exceeded.",
  code: "CAPACITY_EXCEEDED",
  details: {
    vehicleCapacity: 1000,
    currentLoad: 800,
    orderWeight: 300,
    remainingCapacity: 200
  }
}
```

#### Farmer Ownership Error
When a samiti attempts to record a collection for a farmer from another samiti:
```typescript
{
  message: "Cannot create collection. Farmer does not belong to this samiti.",
  code: "FARMER_OWNERSHIP_MISMATCH",
  details: {
    farmerId: 456,
    farmerSamitiId: 2,
    currentSamitiId: 1
  }
}
```

## Testing Strategy

### Unit Testing

Unit tests will verify individual functions and components in isolation using Vitest and React Testing Library.

**Backend Unit Tests:**
- Business logic functions (pricing calculation, credit blocking check, capacity validation)
- Data transformation utilities
- Authentication middleware
- Validation functions

**Frontend Unit Tests:**
- Component rendering with various props
- Form validation logic
- Utility functions (date formatting, number formatting)
- Custom hooks

Example unit test:
```typescript
describe('calculateMilkPrice', () => {
  it('should calculate correct price for given FAT and SNF', () => {
    const result = calculateMilkPrice(4.5, 8.5);
    expect(result).toBeCloseTo(32.5, 2);
  });
  
  it('should throw error for invalid FAT value', () => {
    expect(() => calculateMilkPrice(10, 8.5)).toThrow('Invalid FAT value');
  });
});
```

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using fast-check library for TypeScript.

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with format: `**Feature: dairy-dashboard-integration, Property {number}: {property_text}**`
- Tests run as part of CI/CD pipeline

**Key Property Tests:**

1. **Aggregation Properties**: Test that summaries correctly aggregate source data
   - Invoice totals match sum of collections
   - Payout amounts match sum of collections
   - Order totals match sum of order items
   - Vehicle utilization matches assignments

2. **Filtering Properties**: Test that filters return correct subsets
   - Date range filters
   - Status filters
   - Role-based data access

3. **Calculation Properties**: Test that calculations are correct
   - Milk pricing from FAT/SNF
   - Order totals from items
   - Vehicle capacity remaining
   - Account balances

4. **State Transition Properties**: Test that state changes have correct effects
   - Invoice payment enables payouts
   - Payment updates order status
   - Assignment updates vehicle load
   - Logout clears session

5. **Validation Properties**: Test that invalid inputs are rejected
   - Credit blocking prevents orders
   - Capacity limits prevent assignments
   - Farmer ownership prevents cross-samiti collections
   - Role mismatch prevents authentication

Example property test:
```typescript
import fc from 'fast-check';

/**
 * Feature: dairy-dashboard-integration, Property 21: Invoice generation aggregation
 */
describe('Invoice generation', () => {
  it('should aggregate collections correctly', () => {
    fc.assert(
      fc.property(
        fc.array(milkCollectionArbitrary, { minLength: 1, maxLength: 50 }),
        fc.date(),
        fc.date(),
        (collections, startDate, endDate) => {
          // Ensure endDate > startDate
          if (endDate <= startDate) return true;
          
          // Filter collections within period
          const periodCollections = collections.filter(c => 
            c.date >= startDate && c.date <= endDate
          );
          
          if (periodCollections.length === 0) return true;
          
          // Generate invoice
          const invoice = generateInvoice(periodCollections, startDate, endDate);
          
          // Verify aggregation
          const expectedQuantity = periodCollections.reduce((sum, c) => sum + c.quantityLitre, 0);
          const expectedAmount = periodCollections.reduce((sum, c) => sum + c.totalAmount, 0);
          
          return Math.abs(invoice.totalQuantityLitres - expectedQuantity) < 0.01 &&
                 Math.abs(invoice.totalAmount - expectedAmount) < 0.01;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

Integration tests will verify that components work together correctly:

- API endpoint tests with database
- Authentication flow tests
- Multi-step workflows (order creation → payment → assignment)
- Role-based access control

### End-to-End Testing

E2E tests will verify complete user workflows:

- Owner creates samiti → Samiti records collection → Owner pays invoice → Samiti pays farmer
- Distributor places order → Makes payment → Logistics assigns to vehicle
- Farmer views collections and payouts
- Credit blocking and unblocking flow

## Implementation Notes

### Database Schema Extensions

The following models need to be added to the Prisma schema:

```prisma
model SamitiInvoice {
  id                   Int      @id @default(autoincrement())
  samitiId             Int
  periodStart          DateTime
  periodEnd            DateTime
  totalQuantityLitres  Float
  totalAmount          Float
  status               String   // "PENDING" | "PAID"
  paidOn               DateTime?
  createdAt            DateTime @default(now())
  
  samiti               Samiti   @relation(fields: [samitiId], references: [id])
  payouts              FarmerPayout[]
}

model FarmerPayout {
  id                   Int      @id @default(autoincrement())
  farmerId             Int
  samitiId             Int
  invoiceId            Int
  periodStart          DateTime
  periodEnd            DateTime
  totalQuantityLitres  Float
  grossAmount          Float
  deductions           Float    @default(0)
  netAmount            Float
  status               String   // "PENDING" | "PAID"
  paidOn               DateTime?
  createdAt            DateTime @default(now())
  
  farmer               Farmer   @relation(fields: [farmerId], references: [id])
  samiti               Samiti   @relation(fields: [samitiId], references: [id])
  invoice              SamitiInvoice @relation(fields: [invoiceId], references: [id])
}

model OrderItem {
  id                   Int      @id @default(autoincrement())
  orderId              Int
  productId            Int
  quantity             Int
  unitPrice            Float
  subtotal             Float
  
  order                DistributorOrder @relation(fields: [orderId], references: [id])
  product              Product   @relation(fields: [productId], references: [id])
}

model Payment {
  id                   Int      @id @default(autoincrement())
  orderId              Int
  amount               Float
  paidOn               DateTime @default(now())
  createdAt            DateTime @default(now())
  
  order                DistributorOrder @relation(fields: [orderId], references: [id])
}

model VehicleAssignment {
  id                   Int      @id @default(autoincrement())
  vehicleId            Int
  orderId              Int
  assignedDate         DateTime @default(now())
  plannedWeightKg      Float
  createdAt            DateTime @default(now())
  
  vehicle              LogisticsVehicle @relation(fields: [vehicleId], references: [id])
  order                DistributorOrder @relation(fields: [orderId], references: [id])
}
```

### API Implementation Priority

1. **Phase 1: Authentication & Core Data**
   - Complete authentication endpoints
   - Owner CRUD for samitis, distributors, products, vehicles
   - Basic dashboard summaries

2. **Phase 2: Milk Collection Flow**
   - Samiti milk collection CRUD
   - Invoice generation and payment
   - Farmer payout creation and payment
   - Farmer dashboard views

3. **Phase 3: Order Flow**
   - Distributor order creation with credit blocking
   - Payment processing
   - Order history and filtering

4. **Phase 4: Logistics Flow**
   - Vehicle assignment with capacity validation
   - Pending orders view
   - Fleet utilization tracking

### Frontend Implementation Priority

1. **Phase 1: Shared Components**
   - Form components (input, select, date picker)
   - Table components with filtering and sorting
   - Modal dialogs
   - Toast notifications

2. **Phase 2: Owner Dashboard**
   - Management pages for all entities
   - Invoice processing interface

3. **Phase 3: Samiti Dashboard**
   - Milk collection form and list
   - Invoice generation
   - Payout management

4. **Phase 4: Farmer Dashboard**
   - Collection history
   - Payment history
   - Summary views

5. **Phase 5: Distributor Dashboard**
   - Product catalog
   - Order creation
   - Payment interface

6. **Phase 6: Logistics Dashboard**
   - Pending orders
   - Vehicle assignment
   - Utilization tracking

### Performance Considerations

- **Database Indexing**: Add indexes on frequently queried fields (dates, foreign keys, status fields)
- **Query Optimization**: Use Prisma's `include` and `select` to fetch only needed data
- **Caching**: React Query caches API responses with configurable stale times
- **Pagination**: Implement cursor-based pagination for large lists
- **Lazy Loading**: Load dashboard sections on demand
- **Debouncing**: Debounce search and filter inputs

### Security Considerations

- **Authentication**: JWT tokens in HTTP-only cookies prevent XSS
- **Authorization**: Middleware validates user role for each endpoint
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection**: Prisma ORM prevents SQL injection
- **CSRF Protection**: SameSite cookie attribute prevents CSRF
- **Rate Limiting**: Implement rate limiting on authentication endpoints
- **Password Hashing**: bcrypt with salt rounds for password storage
