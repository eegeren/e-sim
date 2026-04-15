type MockProvisionInput = {
  orderId: string;
  packageTitle: string;
  coverageLabel: string;
};

export type MockProvisionResult = {
  providerOrderId: string;
  qrCodeUrl: string;
  activationCode: string;
  manualCode: string;
};

function createSeed(input: string) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function createMatrix(seed: number) {
  const size = 21;
  const matrix: boolean[][] = [];

  for (let row = 0; row < size; row += 1) {
    const currentRow: boolean[] = [];

    for (let column = 0; column < size; column += 1) {
      const isFinder =
        (row < 7 && column < 7) ||
        (row < 7 && column > size - 8) ||
        (row > size - 8 && column < 7);

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

        currentRow.push(isBorder || isCore);
        continue;
      }

      const bit = ((seed >> ((row + column) % 24)) & 1) === 1;
      currentRow.push(bit !== ((row * 9 + column * 7 + seed) % 4 === 0));
    }

    matrix.push(currentRow);
  }

  return matrix;
}

function createQrCodeDataUrl(seedSource: string, label: string) {
  const cell = 8;
  const padding = 18;
  const matrix = createMatrix(createSeed(seedSource));
  const size = matrix.length * cell + padding * 2;
  const pixels = matrix
    .flatMap((row, rowIndex) =>
      row.map((filled, columnIndex) =>
        filled
          ? `<rect x="${padding + columnIndex * cell}" y="${padding + rowIndex * cell}" width="${cell}" height="${cell}" rx="1.2" fill="#0f172a" />`
          : "",
      ),
    )
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 56}" viewBox="0 0 ${size} ${size + 56}" fill="none">
      <rect width="${size}" height="${size + 56}" rx="28" fill="#F8FAFC" />
      <rect x="10" y="10" width="${size - 20}" height="${size - 20}" rx="20" fill="#FFFFFF" />
      ${pixels}
      <text x="50%" y="${size + 24}" text-anchor="middle" fill="#0f172a" font-size="13" font-family="Arial, Helvetica, sans-serif">esimQ mock eSIM</text>
      <text x="50%" y="${size + 42}" text-anchor="middle" fill="#475569" font-size="12" font-family="Arial, Helvetica, sans-serif">${label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function provisionMockEsim(
  input: MockProvisionInput,
): Promise<MockProvisionResult> {
  const seed = input.orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-10).toUpperCase();
  const providerOrderId = `prov_${seed}`;
  const activationCode = `LPA:1$esimq.mock$${seed}`;
  const manualCode = `${seed.slice(0, 4)}-${seed.slice(4, 8)}-${seed.slice(8)}`;

  return {
    providerOrderId,
    qrCodeUrl: createQrCodeDataUrl(
      `${input.orderId}:${input.coverageLabel}:${input.packageTitle}`,
      manualCode,
    ),
    activationCode,
    manualCode,
  };
}
