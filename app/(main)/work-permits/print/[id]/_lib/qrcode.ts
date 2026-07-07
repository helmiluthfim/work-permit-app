import QRCode from "qrcode";

/**
 * Generate QR code sebagai base64 data URI (PNG) dari sebuah URL.
 * Data URI ini langsung bisa dipakai sebagai `src` di komponen <Image>
 * milik @react-pdf/renderer.
 */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 200,
    color: {
      dark: "#0F1F3D",
      light: "#FFFFFF",
    },
  });
}

export interface SignatureQrCodes {
  pjTeknik: string | null;
  tenagaAhliK3: string | null;
  direktur: string | null;
}

/**
 * Generate QR code untuk ketiga tanda tangan (PJ Teknik, Tenaga Ahli K3, Direktur)
 * berdasarkan URL gambar TTD masing-masing (hasil upload di halaman /profile,
 * disimpan di User.signatures.<ROLE> — lihat SETUP-TTD-BLOB.md).
 *
 * PENTING: panggil fungsi ini SEBELUM me-render PDF (sebelum renderToBuffer /
 * renderToStream / pdf().toBuffer()), lalu masukkan hasilnya sebagai prop
 * `qrCodes` ke <WorkPermitPage />. @react-pdf/renderer tidak bisa menunggu
 * proses async di dalam pohon komponennya, jadi QR-nya harus sudah jadi
 * data URI sebelum JSX-nya dirender.
 *
 * Contoh pemakaian di route/handler yang menyusun PDF:
 *
 *   const qrCodes = await generateSignatureQrCodes({
 *     pjTeknik: pjTeknikUser?.signatures?.PJ_TEKNIK,
 *     tenagaAhliK3: k3User?.signatures?.TENAGA_AHLI_K3,
 *     direktur: direkturUser?.signatures?.DIREKTUR,
 *   });
 *
 *   <WorkPermitPage permit={permit} qrCodes={qrCodes} />
 */
export async function generateSignatureQrCodes(urls: {
  pjTeknik?: string | null;
  tenagaAhliK3?: string | null;
  direktur?: string | null;
}): Promise<SignatureQrCodes> {
  const [pjTeknik, tenagaAhliK3, direktur] = await Promise.all([
    urls.pjTeknik ? generateQrDataUrl(urls.pjTeknik) : Promise.resolve(null),
    urls.tenagaAhliK3
      ? generateQrDataUrl(urls.tenagaAhliK3)
      : Promise.resolve(null),
    urls.direktur ? generateQrDataUrl(urls.direktur) : Promise.resolve(null),
  ]);

  return { pjTeknik, tenagaAhliK3, direktur };
}
