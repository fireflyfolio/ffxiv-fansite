import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import Lightbox from 'lightbox2';
import LazyLoad from 'vanilla-lazyload';

import Config from '../../../config';

export default Backbone.View.extend({
  template: Nunjucks,

  lazyLoadInstance: new LazyLoad(),

  initialize: function () {
    Lightbox.option({
      'resizeDuration': 150,
      'imageFadeDuration': 300
    });
  },

  render: function (options) {
    this.setElement('#container');

    this.content = options ? options.content || this.content : this.content;

    this.$el.html(this.template.render('pages/picture/container.html', { server: Config.api.server, items: this.content.get('items') }));
    this.lazyLoadInstance.update();

    return this;
  },
});
