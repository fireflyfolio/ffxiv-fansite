import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      sort: 'date',
      sort_dir: 'desc',
      limit: 100,
      range: 10,
      page: 1,
      show_admin: true,
    };
  }
});
