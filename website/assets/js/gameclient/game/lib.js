
Handlebars.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('ifnot', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.inverse(this);
  } else {
    return options.fn(this)
  }
});