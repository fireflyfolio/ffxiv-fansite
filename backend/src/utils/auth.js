import Cookies from 'js-cookie';
import Toastr from 'toastr';

import Config from '../config';
import Router from '../router';

function setAuthorizationHeader () {
  const router = Router.prototype.getInstance();
  return (xhr) => xhr.setRequestHeader('Authorization', `Bearer ${router.session.get('accessToken')}`);
}

function handleFetchModel (model, callback) {
  model.fetch({ beforeSend: setAuthorizationHeader() })
    .then(() => callback())
    .catch(() => {
      Toastr.error('Session expirée');
      signout();
    });
}

function handleSaveModel (model, callback) {
  model.save(null, { beforeSend: setAuthorizationHeader() })
    .then(() => callback())
    .catch(() => {
      Toastr.error('Session expirée');
      signout();
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

  fetch(params.url, options)
    .then((res) => {
      if (res.status === 200) return res.json();
      return new Promise((resolve) => resolve({ data: null }));
    })
    .then((json) => params.callback(json.data))
    .catch((e) => {
      Toastr.error('Session expirée');
      signout();
    });
}

function refreshTokens () {
  const router = Router.prototype.getInstance();

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

        Cookies.set('session.signedIn', router.session.get('signedIn'), { expires: Config.cookies.expires });
        Cookies.set('session.accessToken', router.session.get('accessToken'), { expires: Config.cookies.expires });
        Cookies.set('session.refreshToken', router.session.get('refreshToken'), { expires: Config.cookies.expires });

        clearTimeout(router.session.get('sessionTimeout'));
        router.session.set({ sessionTimeout: setTimeout(() => refreshTokens(), Config.session.timeout) });
      } catch (e) {
        Toastr.error('Session expirée');
        return signout();
      }
    });
}

function signout () {
  const router = Router.prototype.getInstance();

  clearTimeout(router.session.get('sessionTimeout'));

  Cookies.remove('session.signedIn');
  Cookies.remove('session.accessToken');
  Cookies.remove('session.refreshToken');
  Cookies.remove('session.maintainSession');

  router.session.set({ ...router.session.defaults() });
  router.navigate('/signin', { trigger: true });

  return false;
}

export {
  setAuthorizationHeader,
  handleFetchModel,
  handleSaveModel,
  handleFetch,
  refreshTokens,
  signout,
};
