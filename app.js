/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var glob = this;
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    FastClick.attach(document.body);
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {

    // init
    app.view = new appView();
    app.bindRoutes();
    // intiiating application by triggering first hash change

    //app.controllers.signin();
  },
  controller: function (name, handler) {

    if (app.controllers == undefined) {
      app.controllers = new Object();
    }

    // if only a handler is passed and no service is specified for controellr
    if (typeof handler == 'function') {
      app.controllers[name] = handler;

    // if handler is an array of service names and a function at the end
    } else if (handler.constructor === Array && typeof handler[handler.length -1] == 'function') {
      var serviceName = [];
      for (var i = 0; i < handler.length; i++) {
        if (typeof handler[i] == 'string') {};
        serviceName[i] = app.services[ handler[i] ];
      }

      app.controllers[name] = function () {
       handler[handler.length -1].apply(this, serviceName); 
      }

    } else {
      throw ("The " + name + " controller is not defined properly");
    }


  },
  service: function (name, handler) {

    if (app.services == undefined) {
      app.services = new Object();
    }

      // if only a handler is passed and no service is specified for controellr
    if (typeof handler == 'function') {
      app.services[name] = new handler();

    // if handler is an array of service names and a function at the end
    } else if (handler.constructor === Array && typeof handler[handler.length -1] == 'function') {
      var serviceName = [];
      for (var i = 0; i < handler.length; i++) {
        if (typeof handler[i] == 'string') {};
        serviceName[i] = app.services[ handler[i] ];
      }

      app.services[name] = handler[handler.length -1].apply(this, serviceName); 


    } else {
      throw ("The " + name + " controller is not defined properly");
    }

  },
  bindRoutes: function () {

    // adding RegExp to routes
    for (var i = 0; i < app.config.routes.length; i++) {
      var reg = new RegExp( "^" + app.config.routes[i].path.replace("/:id", "\/\\w+") + "$", 'i', 'g' );
      console.log( reg );
      app.config.routes[i].reg = reg;
    }

    window.onhashchange = function (e) {

      var hash = window.location.hash;
      console.log('on hash change', hash);

      // fixing the path for slash and hash

      var hash = hash.replace('/#', '');
      var hash = hash.replace('#', '');
      if (hash == "") {
        hash == '/'
      }
      console.log('hash fixed for slash', hash);

      // checking the path with all routes to find the matcing route
      for (var i = 0; i < app.config.routes.length; i++) {
        console.log(app.config.routes[i].reg, app.config.routes[i].reg.test(hash));

        // if route is found in config
        if ( app.config.routes[i].reg.test(hash) ) {

          // if route is available in config and controller and view is defnined properly, route to it
          if (typeof app.controllers[app.config.routes[i].controller] == 'function') {
            app.config.currentRoute = i;
            console.log('calling controller: ' + app.config.routes[i].controller)
            app.controllers[app.config.routes[i].controller](); 
            return false; 
          } else {
            console.error('No controller named ' + app.config.routes[i].controller + " exist.")
            return false;
          }
          
        }


      }

      // if route is not available in config, redirect ot the route that otherwise property defines
      if (app.config.otherwise.redirect != undefined) {
        console.warn('redirect to /');
        window.location.hash = app.config.otherwise.redirect;
      } else {
        console.error('no otherwise defined');
      }


    };

    console.log('chaning hash to signin');
    window.location.hash = "signin";
  },

  config: {
    routes: [
      {
        path: "signin",
        controller: "SiginIn",
        view: "templates/signin.html",
        initial: true
      },
      {
        path: "home",
        controller: "Home",
        view: "templates/home.html"
      },
      {
        path: "signup",
        controller: "SignUp",
        view: "templates/signup.html"
      },
      {
        path: "recovery",
        controller: "Recovery",
        view: "templates/recovery.html"
      },
      {
        path: "tour",
        controller: "Tour",
        view: "templates/tour.html"
      },
      {
        path: "bills",
        controller: "Bills",
        view: "templates/bills.html"
      },
      {
        path: "bills/:id",
        controller: "SingleBill",
        view: "templates/single-bill.html"
      },
      {
        path: "setting",
        controller: "Setting",
        view: "templates/setting.html"
      }
    ],
    otherwise: {
      redirect: "home"
    } 
  }

};

app.initialize()
