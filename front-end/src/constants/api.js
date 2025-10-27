export const PATH_TO_ENDPOINT_MAPPING = {
  kobieta: "women",
  mezczyzna: "men",
  dziecko: "children",
};

// Use /api in production (proxied by nginx), localhost:3000 in development
export const BACK_END_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000";
