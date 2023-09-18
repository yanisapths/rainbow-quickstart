export interface Nonce {
    nonce: string;
    issuedAt: string;
    expiredAt: string;
}

export interface GetNonceResponse {
    code: number;
    message: string;
    data: Nonce;
}