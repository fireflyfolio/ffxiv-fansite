import Backbone from 'backbone';

export default Backbone.Model.extend({
  defaults: function () {
    return {
      show_admin: false,
      show_admin_panel1: true,
      show_admin_panel2: true,
      show_admin_panel3: true,
      show_settings: false,
      show_privacy: false,
      layout: 'layout-card-visit',
      limit: 100,
      range: 10,
      page: 1,
      sort: 'date',
      sort_dir: 'desc',
      type: '-1',
      status: '-1',
      search: '',
      tag: -1,
    };
  }
});
