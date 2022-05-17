import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      id: null,
      type: 'article',
      title: 'New title',
      summary: '',
    };
  },
  parse: function (res) {
    return res.data;
  },
});
