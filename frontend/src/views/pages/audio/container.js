import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import LazyLoad from 'vanilla-lazyload';
import Mediabox from 'mediabox';

import Config from '../../../config';

export default Backbone.View.extend({
  template: Nunjucks,
  el: '#container',

  lazyLoadInstance: new LazyLoad(),

  initialize: function (options) {
    this.items = options.items;
  },

  render: function () {
    this.$el.html(this.template.render('pages/audio/container.html', { server: Config.api.server, items: this.items }));
    this.lazyLoadInstance.update();
    Mediabox('.mb');
    return this;
  },
});
