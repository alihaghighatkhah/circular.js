/**
* @name addClass
* @summary adds given className to given element
*
**/
function addClass (element, className) {
  element = ensureIsElement(element);

  if (!hasClass(element, className)) {
    element.className += " " + className;
    element.className = trim(element.className);
  }
  return element;
}
/**
 *
 * @name ensureIsElement
 * @param element {string|object} - CSS selector or DOM object
 * @returns element
 *
 */
function ensureIsElement (element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (element == undefined) {
    return false;
  }

  return element;
}
/**
* @name hasClass
* @summary checks if given elemen has the given className
*
**/
function hasClass (element, className) {
  element = ensureIsElement(element);

  if (element.className) {
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
  element = ensureIsElement(element);

  if (hasClass(element, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      element.className = element.className.replace(reg, ' ');
  }
  element.className = trim(element.className);
  return element;

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
function Http (opts) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function (key) {
        xhr.setRequestHeader(key, opts.headers[key]);
      });
    }
    var params = opts.params;
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      params = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    }
    xhr.send(params);
  });
}
/**
 *
 * @name ServiceProvider
 *
 * @param {string } name - the name of module to be instantiated
 * @param {function|Array} handler - the handler or the  list of dependencies and the handlers
 * @param {string} type - service|controller|directive
 * @param {string} moduleName - name of the module of noname that this moduleProvider works on
 * @returns {function} - the propered modules
 */
function moduleProvider (name , handler, type, moduleName) {
  console.log(name ,type, moduleName);


  handler.dependencies = [];
  // this could be app.services, app.controllers and app.directives
  var nonameApp = Noname.getModule(moduleName);
  console.log(Noname);

  // initiating the collection if needed
  if (nonameApp[type + 's'] == undefined) {
    nonameApp[type + 's'] = {};
  }

  var collection = nonameApp[type + 's'];
  var servicesCollection = nonameApp.services;
  var module = null;



  // if only a handler is passed and no service is specified for controellr
  if (typeof handler === 'function') {
    module = handler;
    module.prototype.$name = name;
    module.prototype.$type = type;
    collection[name] = module;

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
    collection[name] = module;
    return module;


  } else {
    Errors.throw({
      message: "improperDefinition",
      module: type,
      name: name
    });
  }
}

function View() {

}


View.prototype.getTemplateFor = function (path) {

  // check if path is a string, otherwise don't try to fetch it
  if (typeof path !== 'string') {
    return false;
  }

  return Http({
    method: 'GET',
    url: path
  })
  .then(function (data) {
    return data;
  })
  .catch(function (err) {
    console.error('Augh, there was an error!', err.statusText);
  });


};

View.prototype.renderForData = function (template, data) {

  var settings = {
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode: /\{\{!([\s\S]+?)\}\}/g,
    use: /\{\{#([\s\S]+?)\}\}/g,
    define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: 'it',
    strip: true,
    append: true,
    selfcontained: false
  };


  var profiler = doT.template(template, settings);
  // appending to view
  return profiler(data);


};


View.prototype.renderTemplate = function (templateUrl, data, target) {

  var self = this;
  target = ensureIsElement(target);
  // get template
  this.getTemplateFor(templateUrl).done(function (template) {
    // bind data to it
    // bind to target
    target.innerHTML = self.renderForData(template, data);
  });

  return this;

};

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

Noname = {};

Noname.module = function (name, config) {

  return this.init.call(this, name, config);

};


Noname.modules = {};


Noname.getModule = function (name) {
  return this.modules[name];
};


Noname.setModule = function (ins, name, config) {
  var module = merge(config, {name: name});
  module = merge(ins, module);
  this.modules[name] = module;
  return module;
};


Noname.init = function (moduleName, config) {

  // if calling a  currently define module, return it
  if ( typeof moduleName === 'string' && config == undefined) {
    return this.getModule(moduleName);
  }

  var ins = {};

  // call routeProvider for routes in config

  ins.RouteProvider = new RouteProvider();
  ins.RouteProvider.moduleName = moduleName;
  ins.RouteProvider.init();



  // call  moduleProvider for every service definition
  ins.service = function (name, dependencies) {
    moduleProvider(name, dependencies, 'service', this.module.name);
  };


  // call moduleProvider for every controller definition
  ins.controller = function (name, dependencies) {
    moduleProvider(name, dependencies, 'controller', this.module.name);
  };


  // call moduleProvider for every directive definition
  ins.directive = function (name, dependencies) {
    moduleProvider(name, dependencies, 'directive', this.module.name);
  };


  // return the module
  ins.module = this.setModule(ins, moduleName, config);

  return ins;

};
