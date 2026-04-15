import {
  createEsimOrder as createProviderEsimOrder,
  getEsimStatus as getProviderEsimStatus,
  getQrCode as getProviderQrCode,
} from "@/lib/services/esimProvider";

export type EsimProviderOrderInput = {
  orderId: string;
  packageId: string;
  packageTitle: string;
  coverageLabel: string;
  customerEmail: string;
};

export type EsimProvisionedProfile = {
  providerOrderId: string;
  qrCodeUrl: string;
  activationCode: string;
  manualCode: string;
  iccid: string;
  smdpAddress: string;
  status: "pending" | "active" | "failed";
};

export async function createEsimOrder(
  input: EsimProviderOrderInput,
): Promise<EsimProvisionedProfile> {
  const result = await createProviderEsimOrder(input);

  return {
    providerOrderId: result.externalOrderId,
    qrCodeUrl: result.qrCodeUrl,
    activationCode: result.activationCode,
    manualCode: result.manualCode,
    iccid: result.iccid,
    smdpAddress: result.smdpAddress,
    status: result.status,
  };
}

export async function getEsimStatus(providerOrderId: string) {
  const result = await getProviderEsimStatus(providerOrderId);

  return {
    providerOrderId: result.externalOrderId,
    status: result.status,
  };
}

export async function getQrCode(providerOrderId: string) {
  return getProviderQrCode(providerOrderId);
}
