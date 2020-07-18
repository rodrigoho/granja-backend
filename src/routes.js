import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import CustomerController from './app/controllers/CustomerController';
import EggController from './app/controllers/EggController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
// import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';
import CargoPackingController from './app/controllers/CargoPackingController';
import AdditionaFeeController from './app/controllers/AdditionaFeeController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Global middleware
routes.use(authMiddleware);

routes.get('/customers', CustomerController.index);
routes.get('/customers/:id', CustomerController.filteredById);
routes.post('/customers', CustomerController.store);
routes.put('/customers/:id', CustomerController.update);
routes.delete('/customers/:id', CustomerController.delete);

routes.post('/additional-fee', AdditionaFeeController.store);
routes.get('/additional-fee', AdditionaFeeController.index);
routes.put('/additional-fee/:id', AdditionaFeeController.update);

routes.get('/red-eggs', EggController.indexRed);
routes.get('/white-eggs', EggController.indexWhite);
routes.get('/eggs', EggController.index);
routes.get('/eggs/:id', EggController.filteredIndex);
routes.post('/eggs', EggController.store);
routes.put('/eggs', EggController.update);

routes.get('/cargo-packing', CargoPackingController.indexAll);
routes.get('/cargo-packing/:id', CargoPackingController.filteredById);
routes.get('/cargo-packings/:id', CargoPackingController.filteredByCustomer);
routes.post('/cargo-packing', CargoPackingController.store);
routes.put('/cargo-packing/:id', CargoPackingController.update);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

// routes.get('/notifications', NotificationController.index);
// routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
