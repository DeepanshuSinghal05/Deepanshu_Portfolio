import signatureMarkup from '../assets/identity/ds-signature.svg?raw';

export function Signature() {
  return (
    <div className="identity-composition" aria-label="Deepanshu Singhal signature">
      <p className="identity-eyebrow" data-identity-label>The human behind the systems</p>
      <div className="signature" data-signature dangerouslySetInnerHTML={{ __html: signatureMarkup }} />
      <div className="signature-caption" data-signature-caption>
        <p>Deepanshu Singhal</p>
        <span>AI PRODUCT ENGINEER</span>
      </div>
      <span className="identity-rule" data-identity-rule aria-hidden="true" />
    </div>
  );
}
