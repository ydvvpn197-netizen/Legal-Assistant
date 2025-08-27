import PDFDocument from 'pdfkit';

export type NdaInput = {
  partyAName: string;
  partyBName: string;
  effectiveDate: string;
  termMonths: number;
};

export async function generateNdaPdf(input: NdaInput): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  return await new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Mutual Non-Disclosure Agreement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text('This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Between: ${input.partyAName} and ${input.partyBName}`);
    doc.text(`Effective Date: ${input.effectiveDate}`);
    doc.text(`Term: ${input.termMonths} months`);
    doc.moveDown();
    doc.text(
      'The parties intend to share confidential information for evaluating a potential business relationship and agree to keep such information confidential in accordance with the terms outlined in this Agreement.'
    );
    doc.moveDown();
    doc.text('1. Definitions and Confidentiality Obligations');
    doc.text('2. Permitted Use and Required Safeguards');
    doc.text('3. Term, Return/Destruction, and Remedies');
    doc.text('4. Governing Law: India');
    doc.moveDown();
    doc.text('Signed:', { underline: true });
    doc.text(`${input.partyAName} ____________________`);
    doc.text(`${input.partyBName} ____________________`);

    doc.end();
  });
}
