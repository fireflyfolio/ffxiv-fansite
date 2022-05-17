import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../../config';
import Router from '../../../router';
import { handleFetchModel } from '../../../utils/auth';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.more': 'onClick',
  },

  initialize: function (options) {
    this.content = options.content;
    this.relations = options.relations;

    this.router = Router.prototype.getInstance();
  },

  render: function () {
    this.relations.url = Config.api.server + Config.api.backend.contents_relations.replace('{id}', this.content.get('id'));

    const cb = () => this.$el.html(this.template.render('admin/extra/relation.html'));
    handleFetchModel(this.relations, cb);

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
