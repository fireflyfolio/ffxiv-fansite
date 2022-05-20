import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import { dateOnly } from '../../../utils/date';

export default Backbone.View.extend({
  template: Nunjucks,

  initialize: function () {
  },

  render: function (options) {
    this.setElement('#container');

    this.contents = options ? options.contents || this.contents : this.contents;

    this.$el.html(this.template.render('pages/archive/container.html', {
      contents: this.contents,
      dateOnly: dateOnly,
    }));

    return this;
  },
});
