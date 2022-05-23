import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../config';
import Router from '../../router';
import RelationCollection from '../../models/content_relation_';
import { getType } from '../../utils/string';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.relation': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.relations = new RelationCollection();
  },

  render: function (options) {
    this.setElement('#more');

    this.content = options ? options.content || this.content : this.content;
    this.id = this.content.get('id');

    this.relations.url = Config.api.server + Config.api.contents + `/${this.id}/relations`;
    this.relations.fetch().then(() => this.$el.html(this.template.render('commons/more.html', {
      relations: this.relations,
      getType: getType,
    })));

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.navigate(e.currentTarget.attributes.href.nodeValue, { trigger: true });
  },
});
