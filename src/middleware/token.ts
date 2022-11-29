import express from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { ERROR_AUTHENTICATE_REQUIRED, ERROR_CLIENT, ERROR_FORBIDDEN } from '../const';
import { UserSchema } from '../mongoose/user';

export const userAuthorization = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authorizationHeader = req.headers.authorization || 'Bearer';
  const authorizations = authorizationHeader.split(' ');
  if (authorizations.length === 2) {
    const token = authorizations[1];
    const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`) as JwtPayload;
    UserSchema.findById(decoded.userId)
      .then(result => {
        if (result?.email === decoded.email) {
          req.body.userId = decoded.userId;
        }
        next();
      })
      .catch(err => next());
  } else {
    next();
  }
};

export const userAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization || 'Bearer';
    const authorizations = authorizationHeader.split(' ');
    if (authorizations.length === 2) {
      const token = authorizations[1];
      const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`) as JwtPayload;
      UserSchema.findById(decoded.userId)
        .then(result => {
          if (result?.email === decoded.email) {
            req.body.userId = decoded.userId;
            next();
          } else {
            res.status(403).json(ERROR_FORBIDDEN);
          }
        })
        .catch(err => res.status(403).json(ERROR_FORBIDDEN));
    } else {
      res.status(401).json(ERROR_AUTHENTICATE_REQUIRED);
      return;
    }
  } catch (err) {
    if (!(err instanceof JsonWebTokenError)) {
      console.error(err);
    }
    res.status(400).json(ERROR_CLIENT);
    return;
  }
};
