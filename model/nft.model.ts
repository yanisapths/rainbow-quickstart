export interface NFTDetail {
    name:        string;
    description: string;
    image:       string;
    attributes:  Attribute[];
}

export interface Attribute {
    trait_type:    string;
    value:         number | string;
    display_type?: string;
}

export interface GetCampaignsResponse {
    code:    number;
    message: string;
    data:    CampaignDetail[];
}

export interface CampaignDetail {
    campaignId:    number;
    campaignName:  string;
    campaignImage: string;
    assetType:     string;
    eventId:       number;
    eventName:     string;
    eventTag:      string;
    startDateTime: string;
    endDateTime:   string;
}
export interface CampaignDetailRes {
    campaignId:      number;
    campaignName:    string;
    campaignImage:   string;
    contractAddress: string;
    assetType:       string;
    qualification:   string;
    eventId:         number;
    eventName:       string;
    eventTag:        string;
    startDateTime:   string;
    endDateTime:     string;
}

export interface ClaimableReq{
    campaignId: string;
    contractAddress: string;
}
export interface ClaimableRes {
    isClaimable: boolean;
    isClaimed:   boolean;
    claimAmount: number;
    signIds:     string[];
    signature:   string;
}


export interface GetAssetsReq {
    walletAddress: string;
}

export interface GetAssetsRes {
    campaignId:      number;
    campaignName:    string;
    eventName:       string;
    eventTag:        string;
    contractAddress: string;
    tokenId:         number;
    assetType: string;
}

export interface NFTMetadata {
    name:          string;
    description:   string;
    image:         string;
    external_link: string;
    attributes:    Attribute[];
}

export interface Attribute {
    trait_type: string;
    value:      string | number;
}
