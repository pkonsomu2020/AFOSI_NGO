import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CAREERS_EMAIL = process.env.CAREERS_EMAIL || 'careers@afosi.org';
const FROM_EMAIL = process.env.FROM_EMAIL || 'applications@afosi.org';

// ─── Build a clean HTML table from the submission data ────────────────────────
function buildEmailHTML({ opportunity, fields, uploads, isSupplier }) {
  const sectionColor = '#e86c24';

  const renderRow = (label, value) => {
    if (!value || value === 'N/A' || value === 'Not Uploaded') return '';
    const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
    const displayValue = isUrl
      ? `<a href="${value}" style="color:${sectionColor};font-weight:600;">Click to Download / View</a>`
      : value;
    return `
      <tr>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#555;background:#f9f9f9;width:35%;border-bottom:1px solid #eee;vertical-align:top;">${label}</td>
        <td style="padding:10px 16px;font-size:13px;color:#222;background:#fff;border-bottom:1px solid #eee;">${displayValue}</td>
      </tr>`;
  };

  const renderSection = (title, rows) => `
    <tr>
      <td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#fff;background:${sectionColor};">
        ${title}
      </td>
    </tr>
    ${rows}`;

  let sectionsHTML = '';

  if (isSupplier) {
    sectionsHTML += renderSection('Applicant Identity', [
      renderRow('Full Name', fields.fullName),
      renderRow('Applying As', fields.applyingAs),
      renderRow('Organization Name', fields.organizationName),
      renderRow('Supplier Type', fields.supplierType),
      renderRow('Years in Operation', fields.yearsInOperation),
      renderRow('Prequalification Category', fields.categoryApplied),
    ].join(''));

    sectionsHTML += renderSection('Contact Information', [
      renderRow('Primary Contact Person', fields.primaryContact),
      renderRow('Job Title', fields.jobTitle),
      renderRow('Phone Number', fields.phoneNumber),
      renderRow('Alternative Phone', fields.altPhoneNumber),
      renderRow('Email Address', fields.emailAddress),
    ].join(''));

    sectionsHTML += renderSection('Areas of Specialisation', [
      renderRow('Specialisations', Array.isArray(fields.specialisations) ? fields.specialisations.join(', ') : fields.specialisations),
      renderRow('Geographic Coverage', Array.isArray(fields.geographicCoverage) ? fields.geographicCoverage.join(', ') : fields.geographicCoverage),
    ].join(''));

    sectionsHTML += renderSection('Compliance & Banking', [
      renderRow('Legally Registered', fields.legallyRegistered),
      renderRow('Tax Compliance', fields.taxCompliance),
      renderRow('Active Bank Account', fields.activeBankAccount),
      renderRow('Bank Details', fields.bankAccountDetails),
    ].join(''));

    sectionsHTML += renderSection('Uploaded Documents', [
      renderRow('Certificate of Registration', uploads.registrationCertificate),
      renderRow('Tax Compliance Certificate', uploads.taxComplianceCert),
      renderRow('Lead CV / Resume', uploads.leadCv),
      renderRow('Professional Licenses', uploads.licenses),
    ].join(''));

    sectionsHTML += renderSection('Additional Info', [
      renderRow('How They Heard', fields.howHeard),
    ].join(''));
  } else {
    sectionsHTML += renderSection('Applicant Details', [
      renderRow('Full Name', fields.applicantName),
      renderRow('Email Address', fields.applicantEmail),
      renderRow('Phone Number', fields.applicantPhone),
      renderRow('LinkedIn Profile', fields.linkedinUrl),
    ].join(''));

    sectionsHTML += renderSection('Cover Letter', [
      renderRow('Message / Pitch', fields.coverLetterText),
    ].join(''));

    sectionsHTML += renderSection('Uploaded Documents', [
      renderRow('CV / Resume', uploads.jobCv),
      renderRow('Cover Letter Document', uploads.jobCoverLetter),
      renderRow('Certificates / Transcripts', uploads.jobCertificates),
    ].join(''));
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:680px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#0C0A08;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#e86c24;font-weight:800;">Action for Sustainability Initiative</p>
      <h1 style="margin:0;font-size:22px;color:#F5EFE6;font-weight:800;">
        ${isSupplier ? 'Supplier Prequalification Application' : 'Job Application Received'}
      </h1>
    </div>

    <!-- Alert bar -->
    <div style="background:${sectionColor};padding:14px 24px;display:flex;align-items:center;gap:12px;">
      <p style="margin:0;color:#fff;font-size:13px;font-weight:700;">
        Position: ${opportunity.title} &nbsp;|&nbsp; ID: ${opportunity.id}
      </p>
    </div>

    <!-- Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e0e0e0;border-top:none;">
      ${sectionsHTML}
    </table>

    <!-- Footer -->
    <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 12px 12px;padding:20px 24px;">
      <p style="margin:0;font-size:11px;color:#999;text-align:center;">
        This submission was received via the AFOSI online application portal at afosi.org.<br>
        <strong style="color:#555;">Reply directly to this email to contact the applicant.</strong>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Build a confirmation email for the applicant ─────────────────────────────
function buildConfirmationHTML({ applicantName, opportunityTitle, isSupplier }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:#0C0A08;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#e86c24;font-weight:800;">Action for Sustainability Initiative</p>
      <h1 style="margin:0;font-size:22px;color:#F5EFE6;font-weight:800;">Application Received!</h1>
    </div>
    <div style="background:#fff;border:1px solid #e0e0e0;border-top:none;padding:32px;">
      <p style="font-size:15px;color:#333;">Dear <strong>${applicantName}</strong>,</p>
      <p style="font-size:14px;color:#555;line-height:1.7;">
        Thank you for submitting your ${isSupplier ? 'prequalification application' : 'application'} for the position of 
        <strong>${opportunityTitle}</strong> at AFOSI.
      </p>
      <p style="font-size:14px;color:#555;line-height:1.7;">
        We have received your details and our team will review your submission carefully. 
        If your profile matches our requirements, we will be in touch with the next steps.
      </p>
      <div style="background:#f9f9f9;border-left:4px solid #e86c24;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
        <p style="margin:0;font-size:13px;color:#333;font-weight:600;">What happens next?</p>
        <p style="margin:6px 0 0;font-size:13px;color:#555;line-height:1.6;">
          Our HR team reviews all applications within <strong>7–14 business days</strong>. 
          You will receive a follow-up email from <strong>careers@afosi.org</strong> if shortlisted.
        </p>
      </div>
      <p style="font-size:13px;color:#999;">
        Questions? Contact us at <a href="mailto:careers@afosi.org" style="color:#e86c24;">careers@afosi.org</a>
      </p>
    </div>
    <div style="background:#f4f4f4;padding:16px;text-align:center;border-radius:0 0 12px 12px;">
      <p style="margin:0;font-size:11px;color:#aaa;">Action for Sustainability Initiative — afosi.org</p>
    </div>
  </div>
</body>
</html>`;
}

// ─── POST /api/apply ──────────────────────────────────────────────────────────
export const submitApplication = async (req, res) => {
  try {
    const { opportunity, fields, uploads, isSupplier } = req.body;

    if (!opportunity?.id || !opportunity?.title) {
      return res.status(400).json({ success: false, message: 'Missing opportunity information.' });
    }

    const applicantName = isSupplier ? (fields?.fullName || 'Applicant') : (fields?.applicantName || 'Applicant');
    const applicantEmail = isSupplier ? fields?.emailAddress : fields?.applicantEmail;
    const subject = isSupplier
      ? `[SUPPLIER PREQUALIFICATION] ${applicantName} — Category: ${fields?.categoryApplied || 'N/A'}`
      : `[JOB APPLICATION] ${applicantName} — Position: ${opportunity.title}`;

    // Send notification email to HR
    const { error: hrError } = await resend.emails.send({
      from: `AFOSI Applications <${FROM_EMAIL}>`,
      to: [CAREERS_EMAIL],
      reply_to: applicantEmail || CAREERS_EMAIL,
      subject,
      html: buildEmailHTML({ opportunity, fields, uploads, isSupplier }),
    });

    if (hrError) {
      console.error('Resend HR email error:', hrError);
      throw new Error(hrError.message || 'Failed to send application email.');
    }

    // Send confirmation email to applicant (only if we have their email)
    if (applicantEmail) {
      await resend.emails.send({
        from: `AFOSI <${FROM_EMAIL}>`,
        to: [applicantEmail],
        subject: `Application Received – ${opportunity.title}`,
        html: buildConfirmationHTML({ applicantName, opportunityTitle: opportunity.title, isSupplier }),
      }).catch(err => {
        // Non-fatal: log but don't block the response
        console.warn('Confirmation email failed (non-fatal):', err.message);
      });
    }

    console.log(`✅ Application submitted: ${subject}`);

    res.json({
      success: true,
      message: 'Application submitted successfully. A confirmation email has been sent.'
    });

  } catch (error) {
    console.error('❌ Application submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application. Please try again.'
    });
  }
};
