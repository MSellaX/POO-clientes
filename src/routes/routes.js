import { Router } from 'express';
const routes = Router()
import categoriaRoutes from './categoriaRoutes.js';
import produtosRoutes from './produtosRoutes.js';
import clienteRoutes from './clienteRoutes.js';

routes.use('/cliente', clienteRoutes);
routes.use('/categorias', categoriaRoutes);
routes.use('/produtos', produtosRoutes);

export default routes;
