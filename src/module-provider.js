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
