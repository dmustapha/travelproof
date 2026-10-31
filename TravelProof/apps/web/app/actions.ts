// File: apps/web/app/actions.ts
"use server";
import { classify } from "@travelproof/core/resolver";
import type { TransferIntent } from "@travelproof/core/types";

export async function classifyAction(intent: TransferIntent) {
  return classify(intent); // pure, synchronous; used for the instant applicability banner
}
