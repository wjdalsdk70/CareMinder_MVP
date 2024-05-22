import useSession from "../hooks/useSession";
import { authFetch } from "../core/api";

const BASE_URL = "https://careminder.shop/api";
// const BASE_URL = "http://15.164.47.170:8000/classify"
// https://careminder.shop/ai/classify/

export async function ai(text) {
  const response = await fetch(`http://localhost:8000/classify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/staffs/login/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function refresh({ refreshToken }) {
  const response = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function logout({ refreshToken }) {
  const response = await fetch(`${BASE_URL}/token/blacklist/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getRequests(session) {
  const response = await authFetch(session, `${BASE_URL}/requests/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getRequestsFiltered(
  session,
  {
    forType = [],
    isQuestion = [],
    state = [],
    tablet = [],
    staff = [],
    staffType = [],
    tabletArea = [],
  }
) {
  const params = new URLSearchParams();

  // Function to append parameters
  const appendParams = (key, value) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }
  };

  appendParams("for_type", forType);
  appendParams("is_question", isQuestion);
  appendParams("state", state);
  appendParams("tablet", tablet);
  appendParams("staff", staff);
  appendParams("staff__type", staffType);
  appendParams("tablet__area", tabletArea);

  let url = `${BASE_URL}/requests/?${params.toString()}`;

  const response = await authFetch(session, url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject(response);
  }

  const data = await response.json();
  return data;
}

export async function updateRequest(session, id, state, staff_id) {
  const response = await authFetch(session, `${BASE_URL}/requests/${id}/`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ state, staff_id }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getChatMessages(session, id) {
  const response = await authFetch(
    session,
    `${BASE_URL}/requests/${id}/chat_messages/`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return Promise.reject(response);
  }

  const data = await response.json();
  return data;
}

export async function postChatMessage(
  session,
  requestId,
  { text, from_patient }
) {
  const response = await authFetch(
    session,
    `${BASE_URL}/requests/${requestId}/chat_messages/`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ text, from_patient }),
    }
  );

  if (!response.ok) {
    return Promise.reject(response);
  }

  const data = await response.json();
  return data;
}

export async function getTablets() {
  const response = await fetch(`${BASE_URL}/tablets/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getTablet(id) {
  const response = await fetch(`${BASE_URL}/tablets/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function postTablet(session, name, area_id) {
  const response = await authFetch(session, `${BASE_URL}/tablets/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name, area_id }),
  });

  if (!response.ok) {
    return Promise.reject(response);
  }

  const data = await response.json();
  return data;
}

export async function patchTablet(session, id, name, area_id) {
  const response = await authFetch(session, `${BASE_URL}/tablets/${id}/`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name, area_id }),
  });

  if (!response.ok) {
    return Promise.reject(response);
  }

  const data = await response.json();
  return data;
}

export async function postRequest(
  session,
  text,
  is_question,
  state,
  tablet_id,
  for_type
) {
  const response = await authFetch(session, `${BASE_URL}/requests/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text, is_question, state, tablet_id, for_type }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getSettings(session) {
  const response = await authFetch(session, `${BASE_URL}/settings/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function updateSettings(
  session,
  hospital_title,
  hospital_description,
  notification
) {
  const response = await authFetch(session, `${BASE_URL}/settings/`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      hospital_title,
      hospital_description,
      notification,
    }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function postStaff(
  session,
  username,
  password,
  first_name,
  last_name,
  role,
  type,
  nfc
) {
  const response = await authFetch(session, `${BASE_URL}/staffs/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      first_name,
      last_name,
      role,
      type,
      nfc,
    }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function patchStaff(
  session,
  id,
  username,
  password,
  first_name,
  last_name,
  role,
  type
) {
  const response = await authFetch(session, `${BASE_URL}/staffs/${id}/`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      first_name,
      last_name,
      role,
      type,
    }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function updateStaff(
  session,
  id,
  username,
  first_name,
  last_name,
  role,
  type
) {
  const response = await authFetch(session, `${BASE_URL}/staffs/${id}/`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ username, first_name, last_name, role, type }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getStaffs(session) {
  const response = await authFetch(session, `${BASE_URL}/staffs/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getStaff(session, id) {
  const response = await authFetch(session, `${BASE_URL}/staffs/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getAreas(session) {
  const response = await authFetch(session, `${BASE_URL}/settings/areas/`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function getArea(session, id) {
  const response = await authFetch(
    session,
    `${BASE_URL}/settings/areas/${id}/`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function patchArea(session, id, name) {
  const response = await authFetch(
    session,
    `${BASE_URL}/settings/areas/${id}/`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    }
  );
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}

export async function postArea(session, name) {
  const response = await authFetch(session, `${BASE_URL}/settings/areas/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    return Promise.reject(response);
  }
  const data = await response.json();
  return data;
}
