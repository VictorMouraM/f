import axios from "axios";

const api = axios.create({
  baseURL: "https://w2rlup229k.execute-api.us-east-1.amazonaws.com/Prod/",
});

export default api;