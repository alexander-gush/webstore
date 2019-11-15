const express = require('express');

// eslint-disable-next-line no-multi-assign
express.application.group = express.Router.group = function group(path, router) {
  const expressRouter = express.Router();
  if (router === undefined) {
    this.use(path, expressRouter);
    return expressRouter;
  }
  router(expressRouter);
  this.use(path, expressRouter);
  return expressRouter;
};
