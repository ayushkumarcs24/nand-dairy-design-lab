# Requirements Document

## Introduction

This document specifies the requirements for implementing functional dashboard interactions across all user roles in the Nand Dairy Management System. The system manages milk collection from farmers through samitis (collection centers), product distribution to distributors, and logistics operations. Each role has a dedicated dashboard with specific capabilities that must be fully operational while maintaining existing layouts.

## Glossary

- **Owner**: The top-level administrator representing Nand Dairy with full system access
- **Samiti**: A milk collection center that aggregates milk from multiple farmers
- **Farmer**: A milk supplier who delivers milk to exactly one Samiti twice daily
- **Distributor**: A business entity that orders dairy products from Nand Dairy
- **Logistics User**: A user responsible for vehicle management and order assignments
- **MilkCollection**: A record of milk delivered by a farmer during a specific session
- **Session**: A time period for milk collection, either morning or evening
- **SamitiInvoice**: A billing document from Samiti to Owner for a period's milk collection
- **FarmerPayout**: A payment record from Samiti to Farmer for delivered milk
- **Order**: A product purchase request from a Distributor
- **VehicleAssignment**: The allocation of orders to delivery vehicles
- **FAT**: Fat content percentage in milk used for pricing
- **SNF**: Solids-Not-Fat content percentage in milk used for pricing
- **Credit Blocking Rule**: Business rule preventing distributors from ordering when dues exceed 2 days

## Requirements

### Requirement 1

**User Story:** As an Owner, I want to manage samitis through my dashboard, so that I can create, view, and update collection centers.

#### Acceptance Criteria

1. WHEN the Owner clicks the create samiti button THEN the system SHALL display a form to input samiti details including name, address, and manager information
2. WHEN the Owner submits valid samiti data THEN the system SHALL persist the new samiti record to the database and display confirmation
3. WHEN the Owner views the samiti list THEN the system SHALL display all samitis with their names, addresses, and current status
4. WHEN the Owner clicks on a samiti entry THEN the system SHALL display detailed information including associated farmers and collection statistics
5. WHEN the Owner updates samiti information THEN the system SHALL validate the changes and persist them to the database

### Requirement 2

**User Story:** As an Owner, I want to manage distributors through my dashboard, so that I can control who can order products from Nand Dairy.

#### Acceptance Criteria

1. WHEN the Owner clicks the create distributor button THEN the system SHALL display a form to input distributor details including name, area, and credit limit
2. WHEN the Owner submits valid distributor data THEN the system SHALL create a new distributor record and associated user account
3. WHEN the Owner views the distributor list THEN the system SHALL display all distributors with their names, areas, total orders, and outstanding dues
4. WHEN the Owner clicks on a distributor entry THEN the system SHALL display detailed information including order history and payment status
5. WHEN a distributor has overdue payments exceeding 2 days THEN the system SHALL display a blocked status indicator

### Requirement 3

**User Story:** As an Owner, I want to manage products through my dashboard, so that I can control the catalog available to distributors.

#### Acceptance Criteria

1. WHEN the Owner clicks the add product button THEN the system SHALL display a form to input product details including name, category, variant, pack size, price, and weight
2. WHEN the Owner submits valid product data THEN the system SHALL persist the new product record and make it available for distributor orders
3. WHEN the Owner views the product list THEN the system SHALL display all products with their names, categories, prices, and availability status
4. WHEN the Owner updates product information THEN the system SHALL validate the changes and update all future orders with new pricing
5. WHERE a product is discontinued THEN the system SHALL mark it as unavailable while preserving historical order data

### Requirement 4

**User Story:** As an Owner, I want to manage vehicles through my dashboard, so that I can control the logistics fleet for product delivery.

#### Acceptance Criteria

1. WHEN the Owner clicks the add vehicle button THEN the system SHALL display a form to input vehicle details including name, registration number, and maximum weight capacity
2. WHEN the Owner submits valid vehicle data THEN the system SHALL persist the new vehicle record and make it available for logistics assignments
3. WHEN the Owner views the vehicle list THEN the system SHALL display all vehicles with their registration numbers, capacities, and current assignment status
4. WHEN the Owner clicks on a vehicle entry THEN the system SHALL display detailed information including current load and assignment history
5. WHEN the Owner updates vehicle information THEN the system SHALL validate that current assignments do not exceed new capacity limits

### Requirement 5

**User Story:** As an Owner, I want to view and manage samiti invoices through my dashboard, so that I can process payments for milk collections.

#### Acceptance Criteria

1. WHEN the Owner views the samiti invoices section THEN the system SHALL display all invoices with samiti names, periods, total amounts, and payment status
2. WHEN the Owner clicks on an invoice entry THEN the system SHALL display detailed breakdown including total quantity, period dates, and individual collection summaries
3. WHEN the Owner marks an invoice as paid THEN the system SHALL update the invoice status, record the payment date, and enable the samiti to pay farmers
4. WHEN the Owner filters invoices by status THEN the system SHALL display only invoices matching the selected status criteria
5. WHEN the Owner searches for invoices by samiti name or date range THEN the system SHALL return matching invoice records

### Requirement 6

**User Story:** As a Samiti user, I want to record milk collections from farmers through my dashboard, so that I can track daily milk intake.

#### Acceptance Criteria

1. WHEN the Samiti user clicks the add collection button THEN the system SHALL display a form to input farmer selection, date, session, quantity, FAT, and SNF values
2. WHEN the Samiti user submits valid collection data THEN the system SHALL calculate the price per liter based on FAT and SNF, compute the total amount, and persist the record
3. WHEN the Samiti user views the collection list THEN the system SHALL display all collections with farmer names, dates, sessions, quantities, and amounts
4. WHEN the Samiti user filters collections by date or session THEN the system SHALL display only collections matching the selected criteria
5. WHEN the Samiti user selects a farmer THEN the system SHALL validate that the farmer belongs to that samiti before accepting the collection

### Requirement 7

**User Story:** As a Samiti user, I want to generate invoices for collected milk through my dashboard, so that I can request payment from the Owner.

#### Acceptance Criteria

1. WHEN the Samiti user clicks the generate invoice button THEN the system SHALL display a form to select the period start and end dates
2. WHEN the Samiti user submits valid period dates THEN the system SHALL aggregate all accepted milk collections for that period, calculate totals, and create an invoice record
3. WHEN the Samiti user views the invoice list THEN the system SHALL display all invoices with periods, total quantities, total amounts, and payment status
4. WHEN an invoice is marked as paid by the Owner THEN the system SHALL enable the Samiti user to create farmer payouts for that period
5. IF the Samiti user attempts to generate an invoice for a period with no collections THEN the system SHALL prevent invoice creation and display an error message

### Requirement 8

**User Story:** As a Samiti user, I want to process farmer payouts through my dashboard, so that I can pay farmers for their milk deliveries.

#### Acceptance Criteria

1. WHEN the Samiti user clicks the create payout button THEN the system SHALL display a list of farmers with their total collections and amounts for unpaid periods
2. WHEN the Samiti user selects a farmer and period THEN the system SHALL calculate gross amount from collections, apply any deductions, and compute net amount
3. WHEN the Samiti user submits valid payout data THEN the system SHALL persist the payout record with status pending
4. WHEN the Samiti user marks a payout as paid THEN the system SHALL update the status, record the payment date, and update farmer account balance
5. IF the corresponding samiti invoice is not paid THEN the system SHALL prevent payout creation and display a message indicating payment dependency

### Requirement 9

**User Story:** As a Farmer, I want to view my milk collection history through my dashboard, so that I can track my deliveries and earnings.

#### Acceptance Criteria

1. WHEN the Farmer views the collection history section THEN the system SHALL display all milk collections with dates, sessions, quantities, FAT, SNF, and amounts
2. WHEN the Farmer filters collections by date range THEN the system SHALL display only collections within the specified period
3. WHEN the Farmer views collection details THEN the system SHALL display the calculated price per liter based on FAT and SNF values
4. WHEN the Farmer views daily summary THEN the system SHALL aggregate morning and evening collections for each day
5. WHEN the Farmer views monthly summary THEN the system SHALL aggregate all collections for the selected month with total quantity and amount

### Requirement 10

**User Story:** As a Farmer, I want to view my payment history through my dashboard, so that I can track payments received from the Samiti.

#### Acceptance Criteria

1. WHEN the Farmer views the payment history section THEN the system SHALL display all payouts with periods, gross amounts, deductions, net amounts, and payment status
2. WHEN the Farmer clicks on a payout entry THEN the system SHALL display detailed breakdown including individual collections that comprise the payout
3. WHEN the Farmer views account summary THEN the system SHALL display total earned, total received, and outstanding balance
4. WHEN the Farmer filters payouts by status THEN the system SHALL display only payouts matching the selected status criteria
5. WHEN the Farmer views weekly summary THEN the system SHALL aggregate collections and payouts for the current week

### Requirement 11

**User Story:** As a Distributor, I want to place product orders through my dashboard, so that I can purchase dairy products from Nand Dairy.

#### Acceptance Criteria

1. WHEN the Distributor clicks the create order button THEN the system SHALL display the product catalog with names, categories, variants, pack sizes, and prices
2. WHEN the Distributor selects products and quantities THEN the system SHALL calculate subtotals and display the total order amount
3. WHEN the Distributor submits a valid order THEN the system SHALL persist the order with status placed and create order items for each product
4. IF the Distributor has overdue payments exceeding 2 days THEN the system SHALL prevent order creation and display a message indicating blocked status
5. WHEN the Distributor views order confirmation THEN the system SHALL display order details including products, quantities, amounts, and due date

### Requirement 12

**User Story:** As a Distributor, I want to view my order history through my dashboard, so that I can track my purchases and deliveries.

#### Acceptance Criteria

1. WHEN the Distributor views the order history section THEN the system SHALL display all orders with dates, statuses, total amounts, paid amounts, and due amounts
2. WHEN the Distributor clicks on an order entry THEN the system SHALL display detailed breakdown including individual products, quantities, and prices
3. WHEN the Distributor filters orders by status THEN the system SHALL display only orders matching the selected status criteria
4. WHEN the Distributor views monthly summary THEN the system SHALL aggregate all orders for the selected month with total amount and outstanding dues
5. WHEN the Distributor views due payments THEN the system SHALL display all orders with outstanding balances and their due dates

### Requirement 13

**User Story:** As a Distributor, I want to record payments through my dashboard, so that I can clear my outstanding dues.

#### Acceptance Criteria

1. WHEN the Distributor clicks the make payment button THEN the system SHALL display a list of orders with outstanding dues
2. WHEN the Distributor selects an order and enters payment amount THEN the system SHALL validate that the amount does not exceed the due amount
3. WHEN the Distributor submits valid payment data THEN the system SHALL update the order paid amount, recalculate due amount, and update payment status
4. WHEN the Distributor fully pays an order THEN the system SHALL mark the order as paid and update the distributor's credit status
5. IF the payment clears all overdue amounts THEN the system SHALL unblock the distributor and enable new order placement

### Requirement 14

**User Story:** As a Logistics user, I want to view pending orders through my dashboard, so that I can assign them to vehicles for delivery.

#### Acceptance Criteria

1. WHEN the Logistics user views the pending orders section THEN the system SHALL display all orders with status placed including distributor names, dates, and total weights
2. WHEN the Logistics user clicks on an order entry THEN the system SHALL display detailed breakdown including products, quantities, and calculated total weight
3. WHEN the Logistics user filters orders by date or distributor THEN the system SHALL display only orders matching the selected criteria
4. WHEN the Logistics user views order weight THEN the system SHALL calculate total weight by summing product weights multiplied by quantities
5. WHEN the Logistics user sorts orders by weight THEN the system SHALL display orders in ascending or descending weight order

### Requirement 15

**User Story:** As a Logistics user, I want to assign orders to vehicles through my dashboard, so that I can optimize delivery routes and capacity.

#### Acceptance Criteria

1. WHEN the Logistics user clicks the assign order button THEN the system SHALL display a list of available vehicles with their registration numbers, current loads, and remaining capacities
2. WHEN the Logistics user selects a vehicle and order THEN the system SHALL validate that the order weight plus current load does not exceed vehicle maximum capacity
3. WHEN the Logistics user submits valid assignment data THEN the system SHALL create a vehicle assignment record, update vehicle current load, and change order status to dispatched
4. IF the order weight exceeds vehicle remaining capacity THEN the system SHALL prevent assignment and display an error message indicating capacity constraint
5. WHEN the Logistics user views vehicle assignments THEN the system SHALL display all assignments with vehicle names, order details, and planned weights

### Requirement 16

**User Story:** As a Logistics user, I want to view vehicle utilization through my dashboard, so that I can monitor fleet efficiency.

#### Acceptance Criteria

1. WHEN the Logistics user views the vehicle list THEN the system SHALL display all vehicles with their registration numbers, maximum capacities, current loads, and utilization percentages
2. WHEN the Logistics user clicks on a vehicle entry THEN the system SHALL display detailed information including current assignments and assignment history
3. WHEN the Logistics user filters vehicles by utilization THEN the system SHALL display only vehicles matching the selected utilization range
4. WHEN the Logistics user views daily summary THEN the system SHALL aggregate all assignments for the current day with total orders and total weight
5. WHEN the Logistics user unassigns an order THEN the system SHALL remove the assignment record, update vehicle current load, and change order status back to placed

### Requirement 17

**User Story:** As any user, I want to authenticate through role-specific login pages, so that I can access my appropriate dashboard.

#### Acceptance Criteria

1. WHEN a user navigates to a role-specific login page THEN the system SHALL display a form to input email and password
2. WHEN a user submits valid credentials THEN the system SHALL verify the credentials, validate the user role matches the login page, and create an authenticated session
3. WHEN a user submits invalid credentials THEN the system SHALL display an error message and prevent authentication
4. IF a user attempts to access a login page for a different role THEN the system SHALL prevent authentication even with valid credentials
5. WHEN a user successfully authenticates THEN the system SHALL redirect to the appropriate role-specific dashboard

### Requirement 18

**User Story:** As any authenticated user, I want to navigate between dashboard sections, so that I can access different features without re-authenticating.

#### Acceptance Criteria

1. WHEN a user clicks a navigation link THEN the system SHALL display the corresponding dashboard section without page reload
2. WHEN a user navigates to a section THEN the system SHALL highlight the active navigation item
3. WHEN a user attempts to access a section without authentication THEN the system SHALL redirect to the login page
4. WHEN a user logs out THEN the system SHALL clear the session and redirect to the login page
5. WHEN a user refreshes the page THEN the system SHALL maintain the authenticated session and display the current section

### Requirement 19

**User Story:** As a system, I want to calculate milk pricing based on FAT and SNF values, so that farmers receive fair compensation for milk quality.

#### Acceptance Criteria

1. WHEN a milk collection record is created with FAT and SNF values THEN the system SHALL apply the pricing formula to calculate price per liter
2. WHEN the price per liter is calculated THEN the system SHALL multiply by quantity to compute total amount
3. WHEN FAT or SNF values are outside valid ranges THEN the system SHALL reject the collection and display an error message
4. WHEN the pricing formula is updated THEN the system SHALL apply new rates only to future collections while preserving historical data
5. WHEN a collection is displayed THEN the system SHALL show FAT, SNF, calculated price per liter, and total amount

### Requirement 20

**User Story:** As a system, I want to enforce the distributor credit blocking rule, so that Nand Dairy maintains healthy cash flow.

#### Acceptance Criteria

1. WHEN a distributor attempts to place an order THEN the system SHALL check for any orders with due amounts greater than zero and due dates older than 2 days
2. IF overdue orders exist THEN the system SHALL prevent order creation and display a message listing overdue amounts and due dates
3. WHEN a distributor makes a payment THEN the system SHALL recalculate overdue status and update blocking status accordingly
4. WHEN the Owner views distributor status THEN the system SHALL display blocked status for distributors with overdue payments
5. WHEN all overdue payments are cleared THEN the system SHALL immediately unblock the distributor and enable order placement
