import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      show_settings: false,
      layout: 'layout-card-visit',
      limit: 100,
      range: 10,
      page: 1,
      sort: 'date',
      sort_dir: 'desc',
      type: '-1',
      search: '',
      tag: -1,
    };
  }
});
