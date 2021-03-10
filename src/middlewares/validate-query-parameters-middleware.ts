import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import joiValidate from '@helpers/joi/joi-validator';
import logger from '@lib/logger';

const log = logger.child({ method: 'middlewares/validate-parameters' });

export const validateQueryParameters = (schema: Joi.ObjectSchema) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const queryParameters = request.params.id;
    const value = {
      musicBrainzId: queryParameters
    }
    log.debug(`Query parameters: ${JSON.stringify(queryParameters)}`);

    try {
      joiValidate(schema, value);
    } catch (error) {
      return next(error);
    }
  
    return next();
  }
}
