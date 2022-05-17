import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function (options) {
    this.section = options.section;
    this.items = options.items;
  },

  render: function () {
    this.$el.html(this.template.render('pages/archive/section.html', {
      section: this.section,
      items: this.items
    }));

    return this;
  },
});
