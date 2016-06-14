/**
* @name addClass
* @summary adds given className to given element
*
**/
function addClass (element, className) {
  if (typeof element == 'string') {
    element = document.querySelector(element);
  }
  if (element != undefined && !hasClass(element, className)) {
    element.className += " " + className;
    element.className = trim(element.className);
  }
}
/**
* @name hasClass
* @summary checks if given elemen has the given className
*
**/
function hasClass (element, className) {
  if (typeof element == 'string') {
    element = document.querySelector(element);
  }
  if (element != undefined && element.className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  } else {
    return false;
  }
}
/**
 * @ngdoc method
 * @name has
 * @param {string} name property name to check.
 * @param {object} object to chck if has a property named name
 */
function has (object, name) {
  return object.hasOwnProperty(name);
}
// check object emptiness
function isObjectEmpty (object) {
  var i = 0;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      i++;
    }
  }
  return (i == 0);
}
/**
* @name merge
* @summary merges two given objects and returned the result
*
**/
function merge (obj1, obj2) {
  var obj = {};

  for (var x1 in obj1) {
    if (obj1.hasOwnProperty(x1)) {
      obj[x1] = obj1[x1];
    }
  }

  for (var x2 in obj2) {
    if (obj2.hasOwnProperty(x2) && x2 != '$attr' && x2 != '$$element') {
      obj[x2] = obj2[x2];
    }
  }
  return obj;
};
/**
* @name removeClass
* @summary removes given className from given element
*
**/
function removeClass (element, className) {
  if (typeof element == 'string') {
    element = document.querySelector(element);
  }
  if (element != undefined) {
    if (hasClass(element, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        element.className = element.className.replace(reg, ' ');
    }
    element.className = trim(element.className);
  }
}
/**
* @name ToggleClass
* @summary adds given className to given element
*
**/
function toggleClass (element, className) {
  if (element != undefined && hasClass(element, className)) {
    removeClass(element, className);
  } else if (element != undefined && !hasClass(element, className)) {
    addClass(element, className);
  }
}
/**
* @name trim
* @summary removes non blank spaces from both sides of string
*
**/
function trim (str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
function Errors (config) {

  throw(config.message);

}
/**
 *
 * @name ServiceProvider
 *
 * @param {string } name - the name of module to be instantiated
 * @param {function|Array} handler - the handler or the  list of dependencies and the handlers
 * @param {string} type - service|controller|directive
 * @returns {function} - the propered modules
 */
function moduleProvider (name , handler, type) {


  handler.dependencies = [];
  // this could be app.services, app.controllers and app.directives
  var collection = app[type + 's'];
  var servicesCollection = app.services;
  var module = null;



  // if only a handler is passed and no service is specified for controellr
  if (typeof handler === 'function') {
    module =  new handler();
    module.$name = name;
    module.$type = type;

    return module;

    // if handler is an array of service names and a function at the end
  } else if (handler.constructor === Array && typeof handler[handler.length - 1] == 'function') {

    var serviceName = [];
    for (var i = 0, j = handler.length - 1; i < j; i++) {




      if (typeof handler[i] === 'string' && servicesCollection[ handler[i] ] != undefined) {


        /**
         *
         * preventing circular dependency
         *
         */
        if (servicesCollection[ handler[i]].dependencies.indexOf(name) < 0) {

          serviceName[i] = servicesCollection[ handler[i] ];

        } else {


          Errors.throw({
            message: "circularDependency",
            module: type,
            name: name
          });


        }


      } else {
        Errors.throw({
          message: "improperDependency",
          module: type,
          name: name
        });
      }

    }


    module = handler[handler.length -1].apply(this, serviceName);
    module.$name = name;
    module.$type = type;
    return module;


  } else {
    Errors.throw({
      message: "improperDefinition",
      module: type,
      name: name
    });
  }
}

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

    app.controllers[app.config.routes[i].controller]();

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

      hash = hash.replace('/#', '').replace('#', '');
      if (hash === "") {
        hash = '/';
      }

      if (hash === self.currentRoute) {
        return self;
      }

      self.routeChangeStart.call(self, self.currentRoute, hash);


      // checking the path with all routes to find the matcing route
      for (var i = 0; i < self.routes.length; i++) {
        console.log(self.routes[i].reg, self.routes[i].reg.test(hash));

        // if route is found in config
        if (self.routes[i].reg.test(hash)) {

          // if route is available in config and controller and view is defnined properly, route to it
          if (typeof app.controllers[self.routes[i].controller] === 'function') {

            console.log('calling controller: ' + self.routes[i].controller);

            self.routeChangeSuccess.call(self, self.currentRoute, hash);


          } else {
            self.routeChangeError.call(self, self.currentRoute, hash);
            console.error('No controller named ' + self.routes[i].controller + " exist.")
          }

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

Noname = {};

Noname.module = function (name, config) {

  return this.init.call(this, name, config);

};


Noname.modules = [];



Noname.getModule = function (name) {
  return this.modules[name];
};



Noname.setModule = function (name, config) {
  var module = merge(config, {name: name});
  this.modules[name] = module;
  return module;
};

Noname.init = function (name, config) {

  // if calling a  currently define module, return it
  if ( typeof name === 'string' && config == undefined) {
    return this.getModule(name);
  }

  var ins = {};

  // call routeProvider for routes in config

  ins.RouteProvider = new RouteProvider();


  // call  moduleProvider for every service definition
  ins.service = function (name, dependencies) {
    moduleProvider(name, dependencies, 'service');
  };


  // call moduleProvider for every controller definition
  ins.controller = function (name, dependencies) {
    moduleProvider(name, dependencies, 'controller');
  };

  // call moduleProvider for every directive definition
  ins.controller = function (name, dependencies) {
    moduleProvider(name, dependencies, 'directive');
  };


  // return the module
  ins.module = this.setModule(name, config);

  return ins;

};
