src/
├── main.jsx
├── App.jsx
├── index.css
├── api/
│   ├── axios.js
│   ├── auth.js
│   ├── admin.js
│   ├── trips.js
│   ├── bookings.js
│   ├── wallet.js
│   ├── driver.js
│   ├── freight.js
│   ├── emergency.js
│   └── audit.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── dashboard/
│   │   ├── AdminDashboard.jsx
│   │   ├── DriverDashboard.jsx
│   │   └── CustomerDashboard.jsx
│   ├── admin/
│   │   ├── Users.jsx
│   │   ├── Cities.jsx
│   │   ├── Routes.jsx
│   │   ├── Vehicles.jsx
│   │   ├── VehicleTypes.jsx
│   │   ├── Trips.jsx
│   │   └── Stats.jsx
│   ├── bookings/
│   │   ├── BookTrip.jsx
│   │   ├── MyBookings.jsx
│   │   └── BookingDetails.jsx
│   ├── wallet/
│   │   └── Wallet.jsx
│   ├── driver/
│   │   ├── Manifest.jsx
│   │   └── Settlements.jsx
│   ├── freight/
│   │   ├── CreateOrder.jsx
│   │   ├── Orders.jsx
│   │   └── CustomsDocuments.jsx
│   ├── emergency/
│   │   └── EmergencyLogs.jsx
│   └── audit/
│       └── AuditLogs.jsx
├── components/
│   ├── common/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Logo.jsx
│   │   └── LoadingSpinner.jsx
│   ├── cards/
│   │   └── StatsCard.jsx
│   └── tables/
│       └── DataTable.jsx
├── utils/
│   ├── helpers.js
│   └── constants.js
└── routes/
    └── PrivateRoute.jsx  please don't miss from the backend  payment ,penality, create all 