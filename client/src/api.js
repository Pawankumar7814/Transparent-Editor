export async function api(path, options = {}, tokenKey = "token") {
  const token = localStorage.getItem(tokenKey);
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error(`Cannot connect to the API at ${path}. Is the backend running on port 4000? (${error.message})`);
  }

  const responseText = response.status === 204 ? "" : await response.text();
  let data = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Server returned an invalid response (${response.status})`);
    }
  }
  if (!response.ok) throw new Error(data?.error || `Request failed with status ${response.status}`);
  return data;
}
