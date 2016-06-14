var app = Noname.module("basic", {});

app.controller('homeCtrl', function () {
  console.log("We are in home");
});
app.controller('aboutCtrl', function () {
  console.log("We are in about");



  // Headers and params are optional
  Http({
    method: 'GET',
    url: 'my.json'
  })
  .then(function (data) {
    console.log(data)
  })
  .catch(function (err) {
    console.error('Augh, there was an error!', err.statusText);
  });



});

app.RouteProvider
  .when('/', {
    controller: 'homeCtrl',
    templateUrl : 'home.html'
  })
  .when('about', {
    controller: 'aboutCtrl',
    templateUrl : 'home.html'
  });
