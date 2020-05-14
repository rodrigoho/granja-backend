import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import CustomerController from './app/controllers/CustomerController';
import EggController from './app/controllers/EggController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';
import CargoPackingController from './app/controllers/CargoPackingController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// Global middleware
routes.use(authMiddleware);

routes.get('/customers', CustomerController.index);
routes.post('/customers', CustomerController.store);

routes.get('/eggs', EggController.index);
routes.post('/eggs', EggController.store);
routes.put('/eggs', EggController.update);

routes.get('/cargo-packing', CargoPackingController.indexAll);
routes.get(
  '/cargo-packing/:customer_id',
  CargoPackingController.filteredByCustomer
);
routes.post('/cargo-packing', CargoPackingController.store);
routes.put('/cargo-packing/:id', CargoPackingController.update);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
