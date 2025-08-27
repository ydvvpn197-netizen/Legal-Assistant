import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import type { NdaInput } from './index';

export async function generateNdaDocx(input: NdaInput): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: 'Mutual Non-Disclosure Agreement', heading: HeadingLevel.TITLE }),
          new Paragraph({ text: 'This is general information, not a substitute for legal advice. Consult a licensed advocate for specific matters.' }),
          new Paragraph({ text: `Between: ${input.partyAName} and ${input.partyBName}` }),
          new Paragraph({ text: `Effective Date: ${input.effectiveDate}` }),
          new Paragraph({ text: `Term: ${input.termMonths} months` }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun('The parties intend to share confidential information for evaluating a potential business relationship and agree to keep such information confidential.'),
            ],
          }),
          new Paragraph({ text: '1. Definitions and Confidentiality Obligations' }),
          new Paragraph({ text: '2. Permitted Use and Required Safeguards' }),
          new Paragraph({ text: '3. Term, Return/Destruction, and Remedies' }),
          new Paragraph({ text: '4. Governing Law: India' }),
        ],
      },
    ],
  });
  const buffer = await Packer.toBuffer(doc);
  return buffer as Buffer;
}
