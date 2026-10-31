// File: apps/web/lib/seedIds.ts
import { jobIdFor } from "@travelproof/core/commitment";
export function jobIdForSeed(beneAddr: string): `0x${string}` { return jobIdFor(beneAddr, "seed"); }
