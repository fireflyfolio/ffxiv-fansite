import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      id: null,
      label: '',
      total: 0,
    };
  },
  parse: function (res) {
    return res.data;
  },
});
