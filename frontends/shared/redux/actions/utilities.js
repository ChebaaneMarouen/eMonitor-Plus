export function checkResponse(response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  error.status = response.status;
  throw error;
}

export function endsWithSlash(url) {
  return url[url.length - 1] === '/';
}

export function concatUrl(url, path) {
  return url + (endsWithSlash(url) ? '' : '/') + path;
}
