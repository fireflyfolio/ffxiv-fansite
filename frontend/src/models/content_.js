import Backbone from 'backbone';

export default Backbone.Collection.extend({
  parse: function (res) {
    this.total = res.total;
    return res.data;
  },
});
