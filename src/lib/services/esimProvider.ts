export type EsimOrderInput = {
  orderId: string;
  packageId: string;
  packageTitle: string;
  coverageLabel: string;
  customerEmail: string;
};

export type EsimOrderResult = {
  externalOrderId: string;
  qrCodeUrl: string;
  activationCode: string;
  manualCode: string;
  iccid: string;
  smdpAddress: string;
  status: "pending" | "active" | "failed";
};

export type EsimStatusResult = {
  externalOrderId: string;
  status: "pending" | "active" | "failed";
};

function createSeed(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function createQrCodeDataUrl(seedSource: string, label: string) {
  const seed = createSeed(seedSource);
  const size = 21;
  const cell = 8;
  const padding = 18;
  let pixels = "";

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const isFinder =
        (row < 7 && column < 7) ||
        (row < 7 && column > size - 8) ||
        (row > size - 8 && column < 7);

      let filled = false;

      if (isFinder) {
        const finderRow = row % 7;
        const finderColumn = column % 7;
        const isBorder =
          finderRow === 0 ||
          finderRow === 6 ||
          finderColumn === 0 ||
          finderColumn === 6;
        const isCore =
          finderRow >= 2 &&
          finderRow <= 4 &&
          finderColumn >= 2 &&
          finderColumn <= 4;
        filled = isBorder || isCore;
      } else {
        const bit = ((seed >> ((row + column) % 24)) & 1) === 1;
        filled = bit !== ((row * 9 + column * 7 + seed) % 4 === 0);
      }

      if (filled) {
        pixels += `<rect x="${padding + column * cell}" y="${padding + row * cell}" width="${cell}" height="${cell}" rx="1.2" fill="#0f172a" />`;
      }
    }
  }

  const canvas = size * cell + padding * 2;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas + 56}" viewBox="0 0 ${canvas} ${canvas + 56}" fill="none">
      <rect width="${canvas}" height="${canvas + 56}" rx="28" fill="#F8FAFC" />
      <rect x="10" y="10" width="${canvas - 20}" height="${canvas - 20}" rx="20" fill="#FFFFFF" />
      ${pixels}
      <text x="50%" y="${canvas + 24}" text-anchor="middle" fill="#0f172a" font-size="13" font-family="Arial, Helvetica, sans-serif">esimQ eSIM</text>
      <text x="50%" y="${canvas + 42}" text-anchor="middle" fill="#475569" font-size="12" font-family="Arial, Helvetica, sans-serif">${label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createMockOrder(input: EsimOrderInput): EsimOrderResult {
  const seed = input.orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-12).toUpperCase().padEnd(12, "0");
  const externalOrderId = `mock_${seed}`;
  const manualCode = `${seed.slice(0, 4)}-${seed.slice(4, 8)}-${seed.slice(8, 12)}`;

  return {
    externalOrderId,
    qrCodeUrl: createQrCodeDataUrl(`${input.orderId}:${input.packageId}:${input.customerEmail}`, manualCode),
    activationCode: `LPA:1$esimq.mock$${seed}`,
    manualCode,
    iccid: `8988307${seed.padEnd(13, "0").slice(0, 13)}`,
    smdpAddress: "rsp.esimq.mock",
    status: "active",
  };
}

export async function createEsimOrder(input: EsimOrderInput): Promise<EsimOrderResult> {
  return createMockOrder(input);
}

export async function getEsimStatus(externalOrderId: string): Promise<EsimStatusResult> {
  return {
    externalOrderId,
    status: "active",
  };
}

export async function getQrCode(externalOrderId: string): Promise<Pick<EsimOrderResult, "qrCodeUrl">> {
  return {
    qrCodeUrl: createQrCodeDataUrl(externalOrderId, externalOrderId.slice(-8).toUpperCase()),
  };
}
