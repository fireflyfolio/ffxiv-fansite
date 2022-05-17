import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

export default Backbone.View.extend({
  template: Nunjucks,

  events: {
    'change #sort': 'onSortChange',
    'change #sort_dir': 'onSortDirChange',
  },

  initialize: function (options) {
    this.sections = options.sections;
    this.state = options.state;
  },

  render: function () {
    this.$el.html(this.template.render('pages/archive/options.html', {
      sections: this.sections,
    }));

    return this;
  },

  onSortChange: function (e) {
    this.state.set({ sort: e.currentTarget.value });
  },

  onSortDirChange: function (e) {
    this.state.set({ sort_dir: e.currentTarget.value });
  }
});
