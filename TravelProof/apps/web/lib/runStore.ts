// File: apps/web/lib/runStore.ts
import type { IvmsMessage, Applicability } from "@travelproof/core/types";

export interface RunRecord { jobId: `0x${string}`; applicability: Applicability; ivms: IvmsMessage; verifyVerdict: number; screenVerdict: string; commitmentHash: `0x${string}`; txHash?: string; publishDate?: string; createdAt: number; }
const store = new Map<string, RunRecord>();
export function putRun(r: RunRecord) { store.set(r.jobId, r); }
export function getRun(jobId: string): RunRecord | undefined { return store.get(jobId); }
