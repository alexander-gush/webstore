/* eslint-disable class-methods-use-this */
class Router {
  execute(func) {
    return this[func].bind(this);
  }

  getRoute() {
    return this.execute('route');
  }


  sendErrorWithCode(res, statusCode, message) {
    res.status(statusCode)
      .set({
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Expires: -1,
      })
      .send({ status: 'error', message });
  }
}

module.exports = Router;
