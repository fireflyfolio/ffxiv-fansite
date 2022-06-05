import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Lightbox from 'lightbox2';
import Toastr from 'toastr';

import Router from './router';

// Initialize a template engine
Nunjucks.configure('src/views', { autoescape: true });

// Initialize global plugins
Lightbox.option({
  disableScrolling: true,
  resizeDuration: 100,
  fadeDuration: 0,
  imageFadeDuration: 100,
});

Toastr.options.timeOut = 1500;
Toastr.options.showDuration = 100;
Toastr.options.hideDuration = 100;
Toastr.options.progressBar = true;

// Define your master router on the application namespace and trigger all
// navigation from this instance.
const router = new Router();

// Trigger the initial route and enable HTML5 History API support, set the root
// folder to '/' by default.
Backbone.history.start({ pushState: true, root: '/' });
