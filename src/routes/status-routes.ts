import { getStatus } from '@controllers/status/get';
import { Router } from 'express';


export default Router()
  .get('/', getStatus);
