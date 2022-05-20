import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import LazyLoad from 'vanilla-lazyload';
import Mediabox from 'mediabox';

import Config from '../../../config';

export default Backbone.View.extend({
  template: Nunjucks,

  lazyLoadInstance: new LazyLoad(),

  initialize: function () {
  },

  render: function (options) {
    this.setElement('#container');

    this.content = options ? options.content || this.content : this.content;

    this.$el.html(this.template.render('pages/audio/container.html', { server: Config.api.server, items: this.content.get('items') }));
    this.lazyLoadInstance.update();
    Mediabox('.mb');

    return this;
  },
});
