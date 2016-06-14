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
