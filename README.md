# Water Billing System

A complete web application for managing water billing, customer usage tracking, and payment processing.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Java Spring Boot 3.1.5
- **Database**: SQLite
- **Build Tool**: Maven

## Features

### Customer Features
- **Daily Water Usage Tracking**: View daily water consumption with automatic extra charge calculation when limit is exceeded
- **Monthly Bills**: View monthly bills with base amount, extra charges, late fees, and payment status
- **Unpaid Bill Warnings**: Automatic email notifications for overdue bills
- **Online Payment**: UPI QR code-based payment system

### Admin Features
- **User Management**: Add new users with Aadhaar proof upload
- **Request Management**: View and manage customer requests (new connections, extra water, info updates)
- **Transaction History**: View all payment transactions
- **Revenue Analytics**: Monthly revenue chart visualization

## Project Structure

```
water-billing-system/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/waterbilling/
│       │       ├── config/          # CORS configuration
│       │       ├── controller/       # REST controllers
│       │       ├── dto/             # Data Transfer Objects
│       │       ├── entity/          # JPA entities
│       │       ├── repository/      # JPA repositories
│       │       ├── scheduler/       # Scheduled tasks (bill warnings)
│       │       ├── service/         # Business logic
│       │       └── WaterBillingApplication.java
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── admin/           # Admin HTML pages
│               ├── customer/       # Customer HTML pages
│               ├── css/            # Stylesheets
│               ├── images/         # Images (UPI QR placeholder)
│               ├── js/             # JavaScript files
│               └── index.html      # Login page
├── database/
│   ├── schema.sql                 # Database schema
│   └── seed_data.sql              # Sample data
├── pom.xml                        # Maven dependencies
└── README.md                      # This file
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- SQLite (or SQLiteStudio for database management)

## Setup Instructions

### 1. Clone/Download the Project

Navigate to the project directory:
```bash
cd water-billing-system
```

### 2. Database Setup

#### Option A: Using SQLiteStudio (Recommended)
1. Download and install [SQLiteStudio](https://sqlitestudio.pl/)
2. Open SQLiteStudio and create a new database file: `water_billing.db`
3. Execute the schema file:
   - Go to Database → Execute SQL
   - Open and run `database/schema.sql`
4. Load seed data:
   - Execute `database/seed_data.sql` to populate sample data

#### Option B: Using Command Line
```bash
# Create database and schema
sqlite3 water_billing.db < database/schema.sql

# Load seed data
sqlite3 water_billing.db < database/seed_data.sql
```

### 3. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Database (already configured for SQLite)
spring.datasource.url=jdbc:sqlite:water_billing.db

# Email Configuration (Optional - for bill warnings)
# If you want email notifications, configure your SMTP settings:
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note**: Email configuration is optional. The system will work without it, but warning emails won't be sent.

### 4. Build and Run

#### Using Maven:
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

#### Using IDE:
1. Import the project as a Maven project
2. Run `WaterBillingApplication.java`

The application will start on `http://localhost:8080`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## Default Login Credentials

### Admin
- **Email**: `admin@waterbilling.com`
- **Password**: `password123`

### Customer (Sample)
- **Email**: `rajesh.kumar@email.com`
- **Password**: `password123`

**Note**: All users in the seed data use the password `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Customer Endpoints
- `GET /api/customer/{userId}/usage` - Get daily usage
- `GET /api/customer/{userId}/bills` - Get monthly bills
- `POST /api/customer/payment` - Make payment

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/requests` - Get all requests
- `PUT /api/admin/requests/{requestId}` - Update request status
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/revenue?months=6` - Get monthly revenue

## Database Schema

### Tables
- **users**: Customer and admin user information
- **daily_usage**: Daily water consumption records
- **bills**: Monthly billing information
- **transactions**: Payment transaction records
- **requests**: Customer service requests

See `database/schema.sql` for complete schema details.

## Features in Detail

### Daily Usage Tracking
- Each user has a daily water limit (default: 500 liters)
- If usage exceeds the limit, extra charges are automatically calculated
- Extra charge formula: `(liters_used - daily_limit) * 2.0`

### Bill Generation
- Monthly bills are generated based on daily usage
- Base amount: ₹500 per month
- Extra charges from daily usage
- Late fees added for overdue bills

### Email Warning System
- Scheduled job runs daily at 9 AM
- Checks for overdue bills
- Sends warning emails to customers
- Adds late fee (₹50) if bill is overdue by more than 7 days

### Payment Processing
- UPI QR code displayed for payment
- Payment completion creates transaction record
- Bill status updated to "PAID"

## Development

### Adding New Features
1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create service in `service/` package
4. Create controller in `controller/` package
5. Create DTOs in `dto/` package
6. Update frontend HTML/JS files

### Database Migrations
- The application uses `spring.jpa.hibernate.ddl-auto=update`
- For production, consider using Flyway or Liquibase

## Troubleshooting

### Database Connection Issues
- Ensure `water_billing.db` file exists in the project root
- Check `application.properties` for correct database path

### Email Not Working
- Email is optional - the system works without it
- Check SMTP configuration in `application.properties`
- For Gmail, use App Password instead of regular password

### Port Already in Use
- Change port in `application.properties`: `server.port=8081`

## Sample Data

The seed data includes:
- 1 Admin user
- 15 Customer users
- Daily usage records (30 days per user)
- Monthly bills (3 months per user)
- Payment transactions
- Service requests

## License

This project is for educational/demonstration purposes.

## Support

For issues or questions, please check the code comments or database schema files.

---

**Built with Spring Boot 3.1.5 and SQLite**

