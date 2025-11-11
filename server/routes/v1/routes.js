<<<<<<< HEAD
import express from 'express'

import userRoutes from './users.js'

const router = express.Router()

router.use('/users', userRoutes)

export default router
=======
import express from "express";
import listingRoutes from "./listings.js";
import userRoutes from "./users.js";

const router = express.Router();

router.use("/listings", listingRoutes);
router.use("/users", userRoutes);

export default router;
>>>>>>> c0c82c6 (Initial commit – added working backend (MongoDB connection + listings CRUD))
