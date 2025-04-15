export const googleClientId =
  "484408725212-fk2jfke755huoq3jt6qi30hc2ik4tr27.apps.googleusercontent.com";

export const baseUrl = "http://127.0.0.1:7860";
// export const baseUrl = "http://localhost:8000";

export const apiUrls = {
  // Auth
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
  getMe: "/api/v1/auth/me",
  // User
  findUser: "/api/v1/user/find",
  // Project
  getProjects: "/api/v1/project/",
  createProject: "/api/v1/project/",
  getProject: (projectId) => `/api/v1/project/${projectId}`,
  deleteProject: (projectId) => `/api/v1/project/${projectId}`,
  deletePermanentlyProject: (projectId) => `/api/v1/project/purge/${projectId}`,
  restoreProject: (projectId) => `/api/v1/project/restore/${projectId}`,
  shareProject: (projectId) => `/api/v1/project/share/${projectId}`,
  // Position
  getPositions: (projectId) => `/api/v1/position/${projectId}`,
  getPosition: (projectId, positionId) =>
    `/api/v1/position/${projectId}/${positionId}`,
  createPosition: (projectId) => `/api/v1/position/${projectId}`,
  updateCriteria: (projectId, positionId) =>
    `/api/v1/position/${projectId}/criteria/${positionId}`,
  closePosition: (projectId, positionId) =>
    `/api/v1/position/${projectId}/close/${positionId}`,
  openPosition: (projectId, positionId) =>
    `/api/v1/position/${projectId}/open/${positionId}`,
  deletePosition: (projectId, positionId) =>
    `/api/v1/position/${projectId}/${positionId}`,
  getPublicPosition: (positionId) => `/api/v1/position/public/${positionId}`,
  // JD
  getJD: (projectId, positionId) => `/api/v1/jd/${projectId}/${positionId}`,
  uploadJD: (projectId, positionId) => `/api/v1/jd/${projectId}/${positionId}`,
  // CV
  getCVs: (projectId, positionId) => `/api/v1/cv/${projectId}/${positionId}`,
  getCV: (projectId, positionId, cvId) =>
    `/api/v1/cv/${projectId}/${positionId}/${cvId}`,
  summaryCV: (projectId, positionId, cvId) =>
    `/api/v1/cv/${projectId}/${positionId}/${cvId}/summary`,
  detailCV: (projectId, positionId, cvId) =>
    `/api/v1/cv/${projectId}/${positionId}/${cvId}/detail`,
  uploadCV: (projectId, positionId) =>
    `/api/v1/cv/${projectId}/${positionId}/uploads`,
  watchUploadProgress: (progressId) => `/api/v1/cv/${progressId}`,
  downloadCV: (projectId, positionId, cvId) =>
    `/api/v1/cv/${projectId}/${positionId}/${cvId}/download`,
  uploadCVPublic: (positionId) => `/api/v1/cv/${positionId}/upload`,
  deleteCV: (projectId, positionId, cvId) =>
    `/api/v1/cv/${projectId}/${positionId}/${cvId}`,
  // Match
  matchCVJD: (projectId, positionId) =>
    `/api/v1/match/match_cv_jd/${projectId}/${positionId}`,
  rematchCVs: (projectId, positionId) =>
    `/api/v1/cv/${projectId}/${positionId}/rematch`,
};
