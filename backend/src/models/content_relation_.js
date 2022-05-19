import Backbone from 'backbone';

export default Backbone.Collection.extend({
  parse: function (res) {
    return res.data;
  },
  comparator: 'position',
});
