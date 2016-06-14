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
