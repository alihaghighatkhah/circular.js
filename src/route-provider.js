/**
 *
 *
 * @name RouteProvider
 * @returns {RouteProvider}
 * @constructor
 */
function RouteProvider () {


  this.routes = [];
  this.currentRoute = {};
  this.fallBackRoute = "";
  this.routeChangeStartHandlers = [];
  this.routeChangeEndHandlers = [];
  this.routeChangeSuccessHandlers = [];
  this.routeChangeErrorHandlers = [];
  /**
   *
   * @name when
   * @param {string} path
   * @param {object} config
   *
   * @todo regex must be case insensitive and ideally a config must define this
   */
  this.when = function (path, config) {


    config.reg = new RegExp("^" + path.replace("/:id", "\/\\w+") + "$", 'i', 'g');
    this.routes.push(config);

    // continue the chane
    return this;
  };


  /**
   *
   * @param path
   * @returns {RouteProvider}
   */
  this.otherwise = function (path) {

    this.fallBackRoute = path;

    // continue the chane
    return this;

  };


  /**
   *
   * @todo this may need corrections on path
   * @param {string} path
   */
  this.redirect = function (path) {
    window.location.hash = path;
  };


  /**
   *
   * name: on
   * @param eventName
   * @param callback
   * @returns {RouteProvider}
   *
   */
  this.on = function (eventName, callback) {
    // checking if the event is bound properly
    if (eventName !== 'routeChangeStart' && eventName !== 'routeChangeEnd' && eventName !== 'routeChangeSucces' && eventName !== 'routeChangeError') {

      Errors.throw({
        message: "unknownEvent",
        module: "route",
        name: eventName
      });

      return this;
    }


    // binding event

    this[eventName + "Handlers"].push(callback);

    return this;


  };


  /**
   *
   * @param previousRoute
   * @param nextRoute
   * @returns {RouteProvider}
   */
  this.routeChangeStart = function (previousRoute, nextRoute) {
    for (var i = 0, j = this.routeChangeStartHandlers.length; i < j; i++) {
      this.routeChangeStartHandlers[i].call(this, previousRoute, nextRoute);
    }

    return this;
  };

  /**
   *
   * @param previousRoute
   * @param currentRoute
   * @returns {RouteProvider}
   */
  this.routeChangeEnd = function (previousRoute, currentRoute) {
    for (var i = 0, j = this.routeChangeEndHandlers.length; i < j; i++) {
      this.routeChangeEndHandlers[i].call(this, previousRoute, currentRoute);
    }

    return this;
  };

  /**
   *
   * @param previousRoute
   * @param currentRoute
   * @returns {RouteProvider}
   */
  this.routeChangeSuccess = function (previousRoute, currentRoute) {

    for (var i = 0, j = this.routeChangeSuccessHandlers.length; i < j; i++) {
      this.routeChangeSuccessHandlers[i].call(this, previousRoute, currentRoute);
    }


    return this;
  };

  /**
   *
   * @param previousRoute
   * @param currentRoute
   * @returns {RouteProvider}
   */
  this.routeChangeError = function (previousRoute, currentRoute) {
    for (var i = 0, j = this.routeChangeErrorHandlers.length; i < j; i++) {
      this.routeChangeErrorHandlers[i].call(this, previousRoute, currentRoute);
    }

    // redirect to fall back route
    self.redirect.call(self, self.fallBackRoute);

    return this;
  };


  this.init = function () {


    var self = this;

    return window.onhashchange = function (e) {



      /**
       * getting and normalizing the hash
       *
       * @type {string}
       */
      var hash = window.location.hash;

      hash = hash.replace(/^[^\w]+/g, '');
      if (hash === "") {
        hash = '/';
      }


      if (hash === self.currentRoute) {
        return self;
      }

      /**
       * calling state base even handler
       */
      self.routeChangeStart.call(self, self.currentRoute, hash);


      // checking the path with all routes to find the matcing route
      for (var i = 0; i < self.routes.length; i++) {

        // if route is found in config
        if (self.routes[i].reg.test(hash)) {


          // if route is available in config and controller and view is defnined properly, route to it
          if (typeof Noname.modules[self.moduleName].controllers[self.routes[i].controller] === 'function') {


            /**
             *
             * calling the controller
             *
             *
             */
            Noname.modules[self.moduleName].controllers[self.routes[i].controller].call(Noname.modules[self.moduleName]);

            /**
             * calling state base even handler
             */
            self.routeChangeSuccess.call(self, self.currentRoute, hash);


          } else {
            /**
             * calling state base even handler
             */
            self.routeChangeError.call(self, self.currentRoute, hash);
            console.error("No controller named '" + self.routes[i].controller + "' exist.");
          }

          /**
           * calling state base even handler
           */
          self.routeChangeEnd.call(self, self.currentRoute, hash);
          return self;


        }


      }


      // if the route not found, redirect to "otherwise" path
      self.routeChangeEnd.call(self, self.currentRoute, hash);
      self.routeChangeError.call(self, self.currentRoute, hash);
      return self;


    }


  };


  // return instance of routeProvider
  return this;
}
