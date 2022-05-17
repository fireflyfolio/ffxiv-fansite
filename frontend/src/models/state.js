import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      sort: 'date',
      sort_dir: 'desc',
    };
  }
});
