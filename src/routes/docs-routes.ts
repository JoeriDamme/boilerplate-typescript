import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

// YAML to JSON the swagger docs.
const swaggerDocument = yaml.load('./swagger.yaml');

export default Router()
  .get('/', swaggerUi.setup(swaggerDocument));
  