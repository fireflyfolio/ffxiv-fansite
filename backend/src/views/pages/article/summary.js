import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import Router from '../../../router';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.summary': 'onSummaryClick',
    'click a.anchor': 'onAnchorClick',
  },

  initialize: function () {
    this.router = Router.prototype.getInstance();

    this.listenTo(this.router.dispatcher, 'content:editor:update', () => this.render());
  },

  render: function (options) {
    this.setElement('#summary');

    this.content = options ? options.content || this.content : this.content;

    const body = this.content.get('body');

    this.summaries = (body && body.blocks) ?? [];
    this.summaries = this.summaries.filter(block => block.type === 'header' && block.data.level === 1);

    this.$el.html(this.template.render('pages/article/summary.html', { items: this.summaries }));

    return this;
  },

  onSummaryClick: function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  },

  onAnchorClick: function (e) {
    e.preventDefault();
    const anchor = e.currentTarget.getAttribute('href').substr(1);
    const nodeList = document.querySelectorAll(`[data-anchor="${anchor}"]`);
    const element = Array.from(nodeList).pop();
    const offsetTopAdjustment = 250;

    if (element) window.scrollTo({ top: element.offsetParent.offsetTop + offsetTopAdjustment, behavior: 'smooth' });
  }
});
