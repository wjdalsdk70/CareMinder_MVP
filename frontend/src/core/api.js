import { refresh } from "src/lib/api";

export async function authFetch(session, url, options) {
  options.headers.authorization = "Bearer " + session.accessToken;
  console.log(session.accessToken);
  var rawResponse = await fetch(url, options);

  if (rawResponse.status == 401) {
    try {
      const response = await refresh(session);
      session.login({
        user: session.user,
        accessToken: response.access,
        refreshToken: session.refreshToken,
      });
      options.headers.authorization = "Bearer " + response.access;
      rawResponse = await fetch(url, options);
    } catch (error) {
      session.logout();
      throw error;
    }
  }

  return rawResponse;
}
