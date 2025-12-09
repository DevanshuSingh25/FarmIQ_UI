# Gram Panchayat Reference Code

This directory contains all files that contribute to the **Gram Panchayat (GP)** login feature and its functionality in the FarmIQ application.

## Overview

The Gram Panchayat role allows government officials at the village level to:
- Create and manage farmer profiles
- Access weather information
- View government schemes
- Register farmers with extended details (marital info, children, service eligibility)

## Directory Structure

```
Reference code/
├── frontend/
│   ├── App.tsx
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── GramPanchayatDashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── grampanchayat/
│   │       └── FarmerRegistration.tsx
│   └── services/
│       └── authService.ts
└── backend/
    ├── auth.js
    ├── database.js
    ├── server.js
    └── SUPABASE_GP_MIGRATION.md
```

## File Details

### Frontend Files

#### 1. **App.tsx** (9,428 bytes)
- Main application routing configuration
- Defines all GP-specific routes:
  - `/grampanchayat/dashboard` - GP dashboard
  - `/grampanchayat/create-farmer` - Farmer registration form
  - `/grampanchayat/farmers` - Farmer management (coming soon)
  - `/grampanchayat/ngo-schemes` - Government schemes
  - `/grampanchayat/weather` - Weather forecast
- Includes `ProtectedRoute` wrapper for GP role authentication

#### 2. **components/ProtectedRoute.tsx** (1,728 bytes)
- Route protection component for role-based access control
- Supports 'GP' role alongside 'farmer', 'vendor', and 'admin'
- Redirects unauthorized users to appropriate dashboards
- Shows loading state during authentication checks

#### 3. **contexts/AuthContext.tsx** (2,847 bytes)
- Authentication context provider
- Manages user state and authentication status
- Handles login, logout, and session checking
- Persists user data in localStorage
- Works with GP role type defined in authService

#### 4. **pages/GramPanchayatDashboard.tsx** (20,425 bytes)
- Main dashboard for Gram Panchayat users
- Features:
  - Navigation sidebar with options for:
    - Dashboard
    - Manage Farmers
    - Weather
    - Government Schemes
    - EdgeAI Chatbot
  - "Create for Farmer" button for farmer registration
  - Statistics cards showing:
    - Farmers Registered (24)
    - Extended Profiles (18)
    - Scheme Eligible (15)
    - Activity (12 active this week)
  - Quick access cards for Market Analysis, Government Schemes, and Weather
  - Language selector (English/Hindi/Punjabi)
  - Dark/Light theme toggle
  - Profile and logout options

#### 5. **pages/Login.tsx** (12,236 bytes)
- Login page with GP role selection
- Features:
  - Role selector including 'GP' option
  - Email and password authentication
  - Role-specific descriptions
  - Language selection
  - Responsive design with modern UI

#### 6. **pages/Register.tsx** (14,679 bytes)
- Registration page with GP role option
- Features:
  - Role selection (Farmer, Vendor, Admin, GP)
  - Role-specific descriptions:
    - GP: "Manage farmer registrations and village data"
  - Conditional form fields based on selected role
  - Email, phone, password validation
  - Language preference selection

#### 7. **pages/grampanchayat/FarmerRegistration.tsx** (30,779 bytes)
- Comprehensive farmer registration form for GP users
- Sections:
  1. **Basic Information**
     - Full name, email, phone, password
     - Location, crops grown
  2. **Marital Information**
     - Marital status (Married/Unmarried/Widowed/Divorced)
     - Spouse details (name, age, aadhaar, occupation)
     - Caste category, household income
     - Bank account status
     - Disability status
  3. **Children Details**
     - Number of children (0-6+)
     - For each child: age, gender, school status, disability
  4. **National Service Eligibility**
     - Service member in family (Army/Navy/Air Force/CAPF/Paramilitary)
     - Relation to serviceperson
     - Service certificate details
     - Service ID and discharge information
- Form validation using Zod schema
- TEXT-ONLY fields (no document uploads)

#### 8. **services/authService.ts** (4,710 bytes)
- Authentication service with GP role support
- Type definitions:
  - `User` interface with role: 'farmer' | 'vendor' | 'admin' | 'GP'
  - `LoginCredentials` interface
  - `RegisterData` interface
- API methods:
  - `login()` - User login
  - `register()` - User registration
  - `getSession()` - Session validation
  - `logout()` - User logout
  - `getProfile()` - Get user profile
  - `updateProfile()` - Update user profile
- `getRedirectUrl()` method returns `/grampanchayat/dashboard` for GP role

### Backend Files

#### 1. **auth.js** (3,880 bytes)
- Backend authentication logic
- Handles login, registration, and session management
- Supports GP role in user authentication
- Password hashing and validation
- Session cookie management

#### 2. **database.js** (29,538 bytes)
- Database operations and queries
- User CRUD operations for all roles including GP
- Profile management
- Farmer registration with extended details
- Integration with Supabase database

#### 3. **server.js** (61,275 bytes)
- Main Express server file
- API endpoints for:
  - Authentication (`/api/auth/*`)
  - User profile management (`/api/me/*`)
  - Farmer registration (for GP users)
  - Market prices, weather, schemes, etc.
- CORS configuration
- Session management
- Error handling

#### 4. **SUPABASE_GP_MIGRATION.md** (7,293 bytes)
- Database migration documentation for GP role
- SQL commands to update Supabase database
- Sections:
  1. Update users table to accept 'GP' role
  2. Create extended farmer tables:
     - `farmer_marital_info`
     - `farmer_children_details`
     - `farmer_service_eligibility`
  3. Add GP tracking columns (`created_by_gp_id`)
  4. Row Level Security (RLS) policies:
     - GP can view/edit users and profiles
     - GP has read-only access to schemes
     - GP has full access to extended farmer tables
- Testing queries and verification steps
- Permission summary table

## Key Features

### Authentication & Authorization
- GP role is fully integrated into the authentication system
- Role-based route protection using `ProtectedRoute` component
- Session management with automatic session checks every 5 minutes
- Persistent authentication using localStorage

### Gram Panchayat Dashboard
- Clean, modern UI with green theme
- Statistics overview for village management
- Quick access to key features (Market, Schemes, Weather)
- Navigation sidebar for easy access to all GP features
- Multi-language support (English/Hindi/Punjabi)
- Dark/Light theme toggle

### Farmer Registration
- Extended farmer profile creation
- Four major sections:
  1. Basic farmer details
  2. Marital and household information
  3. Children details for welfare schemes
  4. National service eligibility (ex-servicemen benefits)
- Form validation with Zod
- Responsive design for mobile and desktop

### Database Integration
- Supabase backend with RLS policies
- Separate tables for extended farmer information
- Audit trail with `created_by_gp_id` tracking
- Proper indexing for performance

## Technology Stack

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Lucide React** icons

### Backend
- **Node.js** with Express
- **Supabase** (PostgreSQL)
- **bcrypt** for password hashing
- **express-session** for session management
- **CORS** middleware

## Role Permissions

### Gram Panchayat (GP) Role Can:
✅ Create and register new farmers with extended details  
✅ View and edit all user profiles in their village  
✅ Access weather information  
✅ View government schemes (read-only)  
✅ Manage marital information, children details, and service eligibility  
✅ Track farmers created by GP (audit trail)  

### Gram Panchayat (GP) Role Cannot:
❌ Edit or delete government schemes  
❌ Access vendor-specific features  
❌ Access admin management features  

## API Endpoints Related to GP

### Authentication
- `POST /api/auth/register` - Register new GP user
- `POST /api/auth/login` - GP login
- `GET /api/auth/session` - Validate GP session
- `POST /api/auth/logout` - GP logout

### Profile Management
- `GET /api/me/profile` - Get GP profile
- `PUT /api/me/profile` - Update GP profile

### Farmer Management (GP-specific)
- `POST /api/farmers/create` - Create farmer with extended details (assumed endpoint)
- `GET /api/farmers` - List all farmers (assumed endpoint)
- `PUT /api/farmers/:id` - Update farmer details (assumed endpoint)

## Database Schema

### Users Table
```sql
role VARCHAR CHECK (role IN ('farmer', 'vendor', 'admin', 'GP'))
```

### Extended Farmer Tables
1. **farmer_marital_info**
   - farmer_id, marital_status, spouse_name, spouse_age
   - spouse_aadhaar, spouse_occupation, caste_category
   - household_income, has_bank_account, disability_status
   - created_by_gp_id (tracks which GP created this)

2. **farmer_children_details**
   - farmer_id, child_number, age, gender
   - in_school, disability_status
   - created_by_gp_id

3. **farmer_service_eligibility**
   - farmer_id, has_service, relation_to_serviceperson
   - service_type, service_certificate_number
   - service_id_number, issuing_authority
   - year_of_service, discharge_date
   - created_by_gp_id

## Usage Flow

1. **GP Registration/Login**
   - GP user selects 'GP' role during registration
   - Provides email, phone, password
   - Logs in with GP credentials

2. **GP Dashboard Access**
   - After successful login, redirected to `/grampanchayat/dashboard`
   - Protected by `ProtectedRoute` with `requiredRole="GP"`

3. **Farmer Registration**
   - GP clicks "Create for Farmer" button
   - Navigates to `/grampanchayat/create-farmer`
   - Fills comprehensive registration form
   - Submits to create farmer profile with extended details

4. **Farmer Management**
   - GP can view list of farmers
   - Edit farmer details as needed
   - Track farmers created by their GP office

## Security Considerations

- All GP routes are protected with role-based authentication
- Passwords are hashed using bcrypt
- Session-based authentication with secure cookies
- Row Level Security (RLS) policies in Supabase
- GP users can only perform specific allowed operations
- Audit trail with `created_by_gp_id` for accountability

## Future Enhancements

- Farmer Management page (currently "Coming Soon")
- Bulk farmer registration
- Export farmer data for reports
- Analytics dashboard for GP users
- Integration with government scheme eligibility checking
- Document upload support for farmer profiles

## Notes

- All file paths are relative to the project root (`SIH25010-main`)
- The GP role is abbreviated as 'GP' in code (not 'grampanchayat')
- UI follows the green theme consistent with FarmIQ branding
- Multi-language support is available but translations may need updates
- Form submissions are currently showing alerts (API integration pending)

## Last Updated
December 9, 2025

---

**Total Files**: 12 files  
**Total Size**: ~194 KB  
**Frontend Files**: 8  
**Backend Files**: 4
