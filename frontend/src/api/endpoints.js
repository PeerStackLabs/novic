export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
  },
  DONATIONS: {
    CREATE: '/donations',
    GET_ALL: '/donations',
    GET_ONE: (id) => `/donations/${id}`,
  },
  // TODO: Confirm backend routes for projects
  PROJECTS: {
    GET_ALL: '/projects',
    GET_ONE: (id) => `/projects/${id}`,
  }
};
