export interface IsExist {
    isExist: boolean;
  }
  
  export interface CheckExistingMemberResponse {
    code: number;
    message: string;
    data: IsExist;
  }
  
  export interface RegisterRequest {
    signedMessage: string;
    id: string;
    publicAddress: string;
  }
  
  export interface EditUserProfileReq{
    displayName: string;
    teamId: number;
    roleId: number;
    bio: string;
  }
  