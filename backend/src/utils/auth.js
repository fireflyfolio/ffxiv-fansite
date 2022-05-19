import { options } from 'toastr';
import Config from '../config';
import Router from '../router';

function setAuthorizationHeader () {
  const router = Router.prototype.getInstance();
  return (xhr) => xhr.setRequestHeader('Authorization', `Bearer ${router.session.get('accessToken')}`);
}

function handleFetchModel (model, callback) {
  const router = Router.prototype.getInstance();

  // Run first call
  model.fetch({ beforeSend: setAuthorizationHeader() })
    .then(() => callback())
    .catch(() => {
      // try to refresh tokens
      const formData = new FormData();
      formData.append('refreshToken', router.session.get('refreshToken'));

      fetch(Config.api.server + Config.api.backend.auth + '/refresh', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((json) => {
          try {
            router.session.set({
              signedIn: true,
              accessToken: json.data.accessToken,
              refreshToken: json.data.refreshToken,
            });
          } catch (e) {
            return _signout();
          }

          // Run second call
          model.fetch({ beforeSend: setAuthorizationHeader() })
            .then(() => callback())
            .catch(() => _signout());
        });
    });
}

function handleSaveModel (model, callback) {
  const router = Router.prototype.getInstance();

  // Run first call
  model.save(null, { beforeSend: setAuthorizationHeader() })
    .then(() => callback())
    .catch(() => {
      // try to refresh tokens
      const formData = new FormData();
      formData.append('refreshToken', router.session.get('refreshToken'));

      fetch(Config.api.server + Config.api.backend.auth + '/refresh', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((json) => {
          try {
            router.session.set({
              signedIn: true,
              accessToken: json.data.accessToken,
              refreshToken: json.data.refreshToken,
            });
          } catch (e) {
            return _signout();
          }

          // Run second call
          model.save(null, { beforeSend: setAuthorizationHeader() })
            .then(() => callback())
            .catch(() => _signout());
        });
    });
}

function handleFetch (params) {
  const router = Router.prototype.getInstance();

  const options = {
    method: params.method,
    headers: {
      'Authorization': `Bearer ${router.session.get('accessToken')}`,
      ...params.headers
    }
  };

  if (params.body) options.body = params.body;

  // Run first call
  fetch(params.url, options)
    .then((res) => {
      if (res.status === 200) return res.json();
      return new Promise((resolve) => resolve({ data: null }));
    })
    .then((json) => params.callback(json.data))
    .catch((e) => {
      // try to refresh tokens
      const formData = new FormData();
      formData.append('refreshToken', router.session.get('refreshToken'));

      fetch(Config.api.server + Config.api.backend.auth + '/refresh', { method: 'POST', body: formData })
        .then((res) => res.json())
        .then((json) => {
          try {
            router.session.set({
              signedIn: true,
              accessToken: json.data.accessToken,
              refreshToken: json.data.refreshToken,
            });
          } catch (e) {
            return _signout();
          }

          // Run second call
          fetch(params.url, options)
            .then((res) => res.json())
            .then((json) => params.callback(json.data))
            .catch(() => _signout());
        });
    });
}

function _signout () {
  const router = Router.prototype.getInstance();
  router.session.set({ signedIn: false, accessToken: null, refreshToken: null });
  router.navigate('/signin', { trigger: true });
  return false;
}

export {
  setAuthorizationHeader,
  handleFetchModel,
  handleSaveModel,
  handleFetch,
};
