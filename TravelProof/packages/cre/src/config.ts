// File: packages/cre/src/config.ts
export interface CreConfig {
  schedule: string;
  vaspVerifyUrl: string;
  ofacSdnUrl: string;
  receiver: string;               // TravelRuleAttestation address
  gasLimit: string;
  chainName: string;              // CRE identifies chains by selector/name, not chainId
  chainSelector: string;
}
export const BASE_SEPOLIA = {
  chainId: 84532,
  selector: "10344971235874465080",
  name: "ethereum-testnet-sepolia-base-1",
} as const;
