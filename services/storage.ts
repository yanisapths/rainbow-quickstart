import { GoogleProfile } from "../model/google.model";

export class Storage {
  private static _instance: Storage = new Storage();
  private _userInfo: GoogleProfile = {
    id: "",
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    wallet: "",
  };

  constructor() {
    if (Storage._instance) {
      throw new Error(
        "Error: Instantiation failed: Use Storage.getInstance() instead of new."
      );
    }
    Storage._instance = this;
  }

  public static getInstance(): Storage {
    return Storage._instance;
  }

  public clearGoogleToken() {
    sessionStorage.removeItem("googleToken");
  }

  public setGoogleToken(value: string) {
    sessionStorage.setItem("googleToken", JSON.stringify(value));
  }

  public getGoogleToken() {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("googleToken") || null;
    }
  }

  public isLogginedGoogle() {
    if (typeof window !== "undefined") {
      const googleToken = sessionStorage.getItem("googleToken") || "";
      return googleToken != "" ? true : false;
    }
  }

  public clearProfile() {
    sessionStorage.removeItem("profile");
  }

  public setGoogleProfie(value: GoogleProfile) {
    sessionStorage.setItem("profile", JSON.stringify(value));
  }

  public getGoogleProfile() {
    if (typeof window !== "undefined") {
      return JSON.parse(sessionStorage.getItem("profile")!);
    }
  }

  public clearSessionToken() {
    sessionStorage.removeItem("sessionToken");
  }

  public setSessionToken(value: string) {
    sessionStorage.setItem("sessionToken", value);
  }

  public getSessionToken() {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("sessionToken")!;
    }
  }

  public clearAllSession() {
    this.clearGoogleToken();
    this.clearProfile();
    this.clearSessionToken();
  }
}
