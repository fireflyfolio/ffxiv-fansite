import Backbone from 'backbone';
import Nunjucks from 'nunjucks';
import LazyLoad from 'vanilla-lazyload';

import Config from '../../../config';

export default Backbone.View.extend({
  template: Nunjucks,
  el: '#container',

  lazyLoadInstance: new LazyLoad(),

  initialize: function (options) {
    this.items = options.items;
  },

  render: function () {
    this.$el.html(this.template.render('pages/data/container.html', {
      server: Config.api.server,
      items: this.items,
      isMetaRefActive: this._isMetaRefActive,
    }));
    this.lazyLoadInstance.update();
    return this;
  },

  _isMetaRefActive: function (metadata, meta) {
    const metaRef = metadata.find((item) => item.key === meta.key);
    return metaRef.is_active;
  },
});
