export interface GenSessionRequest{
    signedMessage: string;
    nonce: string | undefined;
    publicAddress: string;
}