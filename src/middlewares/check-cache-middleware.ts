import { Request, Response, NextFunction } from 'express';
import logger from '@lib/logger';
import Cache from '@lib/cache';

const log = logger.child({ method: 'middlewares/check-cache' });

interface CacheMiddleware {
  parameter: string;
  cacheNamespace: string;
}

export const checkCache = (info: CacheMiddleware) => {
  return (request: Request, response: Response, next: NextFunction): void | Response => {
    log.debug(`checkCache middleware args: ${JSON.stringify(info)}`);
    const queryId = request.params[info.parameter];

    if (!queryId) {
      log.error('Given query parameter not found. Please check your configuration of CacheMiddleware.');
      // continue without cache check.
      return next();
    }

    const cacheKey = `${info.cacheNamespace}${queryId}`;
    const cacheValue = Cache.getInstance().get(cacheKey);
  
    if (cacheValue) {
      log.info(`Returning cache key "${cacheKey}"`);
      return response.json(cacheValue);
    }
  
    return next();
  }
}
