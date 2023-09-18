import { GenSessionRequest } from "@/model/session.model";
import HttpClient from "./http-clients";
import { Storage } from "./storage"
import { ClaimableReq, GetAssetsReq } from "@/model/nft.model";
import { GoogleRequest } from "@/model/google.model";
import { RegisterRequest } from "@/model/register.model";

export const getUser = async (recaptcha: string) => {
  return HttpClient.get(`${API_ENDPOINTS.USERINFO}`, {
    headers: {
      Authorization: `Bearer ${Storage.getInstance().getSessionToken()}`,
      "ReCaptcha-Token": `${recaptcha}`,
    },
  });
};


export const getAssets = async (recaptcha: string, req: GetAssetsReq) => {
  return HttpClient.post(`${API_ENDPOINTS.ASSETS}`, req, {
    headers: {
      Authorization: `Bearer ${Storage.getInstance().getSessionToken()}`,
      "ReCaptcha-Token": `${recaptcha}`,
    },
  });
};

export const generateSessionToken = async (
  req: GenSessionRequest,
  recaptcha: string
) => {
  return HttpClient.post(`${API_ENDPOINTS.GENSESSION}`, req, {
    headers: {
      "ReCaptcha-Token": `${recaptcha}`,
    },
  });
};

export const getAccessTokenGoogle = async (
  req: GoogleRequest,
  recaptcha: Recaptcha
) => {
  return HttpClient.post(`${API_ENDPOINTS.GOOGLEAUTHEN}`, req, {
    headers: {
      "ReCaptcha-Token": `${recaptcha.token}`,
    },
  });
};

export const checkExistingMember = async (
  address: string,
  recaptcha: Recaptcha
) => {
  return HttpClient.get(`${API_ENDPOINTS.CHECKEXISTING}/${address}`, {
    headers: {
      Authorization: `Bearer ${Storage.getInstance().getSessionToken()}`,
      "ReCaptcha-Token": `${recaptcha.token}`,
    },
  });
};

export const getNonce = async (recaptcha: string) => {
  return HttpClient.get(`${API_ENDPOINTS.NONCE}`, {
    headers: {
      "ReCaptcha-Token": `${recaptcha}`,
    },
  });
};

export interface Recaptcha {
  token: string;
}

const getRegistrationService = () => {
  return process.env.NEXT_PUBLIC_ENV != "LOCAL"
    ? process.env.NEXT_PUBLIC_API
    : "http://localhost:9090";
};

export const registerMemeber = async (
  req: RegisterRequest,
  recaptcha: Recaptcha
) => {
  return HttpClient.post(`${API_ENDPOINTS.REGISTER}`, req, {
    headers: {
      "ReCaptcha-Token": `${recaptcha.token}`,
    },
  });
};

const getAuthenticationService = () => {
  return process.env.NEXT_PUBLIC_ENV != "LOCAL"
    ? process.env.NEXT_PUBLIC_API
    : "http://localhost:9089";
};

const getOauthService = () => {
  return process.env.NEXT_PUBLIC_ENV != "LOCAL"
    ? process.env.NEXT_PUBLIC_API
    : "http://localhost:9088";
};

export const API_ENDPOINTS = {
  GOOGLEAUTHEN: `${getOauthService()}/oauth-service/v1/oauth/user-info`,
  NONCE: `${getAuthenticationService()}/authentication-service/v1/authen/get-nonce`,
  GENSESSION: `${getAuthenticationService()}/authentication-service/v1/authen/session-token`,
  USERINFO: `${getRegistrationService()}/registration-service/v1/user`,
  ASSETS: `${getRegistrationService()}/registration-service/v1/user/assets`,
  CHECKEXISTING: `${getRegistrationService()}/registration-service/v1/user`,
  REGISTER: `${getRegistrationService()}/registration-service/v1/user`,
};

export interface Nonce {
  nonce: string;
  issuedAt: string;
  expiredAt: string;
}
