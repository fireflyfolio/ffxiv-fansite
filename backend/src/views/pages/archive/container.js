import Backbone from 'backbone';
import Nunjucks from 'nunjucks';

import { dateOnly } from '../../../utils/date';
import { getStatus, getType, getTypeLabel } from '../../../utils/string';

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
      getStatus: getStatus,
      getType: getType,
      getTypeLabel: getTypeLabel,
    }));

    return this;
  },
});
