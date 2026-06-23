const express = require('express');
const { protect } = require('../../middleware/auth');
const { restrictTo } = require('../../middleware/rbac');
const {
    addCity,
    getCities,
    updateCity,
    deleteCity,
    createRoute,
    getRoutes,
    updateRoute,
    deleteRoute,
    registerVehicle,
    getVehicles,
    updateVehicle,
    deleteVehicle,
    getDashboardStats,
    createUserByAdmin, // <-- NEW
} = require('../../controllers/adminController');

const router = express.Router();

router.use(protect, restrictTo('super_admin', 'dispatcher'));

// Cities
router.post('/cities', addCity);
router.get('/cities', getCities);
router.put('/cities/:id', updateCity);
router.delete('/cities/:id', deleteCity);

// Routes
router.post('/routes', createRoute);
router.get('/routes', getRoutes);
router.put('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

// Vehicles
router.post('/vehicles', registerVehicle);
router.get('/vehicles', getVehicles);
router.put('/vehicles/:id', updateVehicle);
router.delete('/vehicles/:id', deleteVehicle);

// Dashboard
router.get('/stats', getDashboardStats);

// 🆕 Admin creates user with role
router.post('/users', createUserByAdmin);

module.exports = router;