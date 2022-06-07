import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'click a.summary': 'onSummaryClick',
    'click a.anchor': 'onAnchorClick',
  },

  initialize: function () {
  },

  render: function (options) {
    this.setElement('#summary');

    this.summaries = (options.body && options.body.blocks) ?? [];
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
