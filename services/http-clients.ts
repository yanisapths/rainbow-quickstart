import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API;
const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "content-type": "application/json",
  },
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const err: any = error.response;
    if (
      err.data.message === "Invalid token."
    ) {
		// window.location.reload();
      console.log("error response: ", err);

    }
    return Promise.reject(error);
  }
);

export default instance;
