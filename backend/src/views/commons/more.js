import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../config';
import Router from '../../router';
import RelationCollection from '../../models/content_relation_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.more': 'onClick',
  },

  initialize: function (options) {
    this.id = options.id;

    this.router = Router.prototype.getInstance();
    this.contents = new RelationCollection();
  },

  render: function () {
    this.contents.url = Config.api.server + Config.api.contents + `/${this.id}/relations`;
    this.contents.fetch().then(() => this.$el.html(this.template.render('commons/more.html', { items: this.contents })));

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
