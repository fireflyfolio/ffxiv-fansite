import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Config from '../../config';
import Router from '../../router';
import TagCollection from '../../models/content_tag_';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.at': 'onClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();
    this.tags = new TagCollection();

    this.listenTo(this.router.dispatcher, 'content:tag:update', (options) => this.render(options));
  },

  render: function (options) {
    this.setElement('#tag');

    this.content = options ? options.content || this.content : this.content;
    this.id = this.content.get('id');

    this.tags.url = Config.api.server + Config.api.contents + `/${this.id}/tags`;
    this.tags.fetch().then(() => this.$el.html(this.template.render('commons/tag.html', { tags: this.tags })));

    return this;
  },

  onClick: function (e) {
    e.preventDefault();
    this.router.state.set({ page: 1, type: -1, search: '', tag: e.currentTarget.attributes['data-id'].nodeValue });
    this.router.navigate(`/archive`, { trigger: true });
  },
});
