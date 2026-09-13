// ─────────────────────────────────────────────────────────────
// AchieveX — Dynamic Milestone Proof Configuration
// Maps Goal Category + Type + Milestone to specific proof requirements.
// Zero proof required for preparatory / planning milestones.
// ─────────────────────────────────────────────────────────────

export interface MilestoneProofRequirement {
  required: boolean;
  proofType?: string;
  label?: string;
  hint?: string;
  acceptedFormats?: string[];
}

/**
 * Default proof requirement for arbitrary milestones not specifically matched.
 */
export const DEFAULT_REQUIRED_PROOF: MilestoneProofRequirement = {
  required: true,
  proofType: 'completion_evidence',
  label: 'Milestone Completion Proof',
  hint: 'Upload official confirmation, screenshot, or certificate.',
  acceptedFormats: ['PDF', 'JPG', 'PNG'],
};

export const NO_PROOF_REQUIRED: MilestoneProofRequirement = {
  required: false,
};

/**
 * Canonical rules mapping categoryId/goalTypeId/milestone keywords to proof requirements.
 */
export function getMilestoneProofRequirement(
  categoryId?: string,
  goalTypeId?: string,
  milestoneLabel?: string
): MilestoneProofRequirement {
  if (!milestoneLabel) return DEFAULT_REQUIRED_PROOF;

  const lower = milestoneLabel.toLowerCase().trim();
  const cat = (categoryId || '').toLowerCase();
  const type = (goalTypeId || '').toLowerCase();

  // ── 1. General Planning & Preparatory Milestones (NO PROOF) ──
  if (
    lower.includes('choose') ||
    lower.includes('topic') ||
    lower.includes('select idea') ||
    lower.includes('finalize idea') ||
    lower.includes('form team') ||
    lower.includes('literature review') ||
    lower.includes('market research') ||
    lower.includes('prepare plan') ||
    lower.includes('strategy') ||
    lower.includes('prior art') ||
    lower.includes('brainstorm')
  ) {
    return NO_PROOF_REQUIRED;
  }

  // ── 2. Research & Publication ──
  if (cat.includes('research') || type.includes('research') || type.includes('paper')) {
    if (lower.includes('draft') || lower.includes('manuscript')) {
      return {
        required: true,
        proofType: 'draft_document',
        label: 'Paper Draft Manuscript',
        hint: 'Upload working draft document (PDF/Word).',
      };
    }
    if (lower.includes('submit') || lower.includes('submission')) {
      return {
        required: true,
        proofType: 'submission_acknowledgement',
        label: 'Submission Acknowledgement / Email',
        hint: 'Upload portal submission receipt or acknowledgment email.',
      };
    }
    if (lower.includes('accept') || lower.includes('accepted')) {
      return {
        required: true,
        proofType: 'acceptance_letter',
        label: 'Acceptance Letter / Acceptance Email',
        hint: 'Upload official acceptance notification from editorial board.',
      };
    }
    if (lower.includes('publish') || lower.includes('published') || lower.includes('presentation')) {
      return {
        required: true,
        proofType: 'publication_proof',
        label: 'Published Paper Link / DOI Screenshot',
        hint: 'Upload published paper screenshot or publication DOI confirmation.',
      };
    }
  }

  // ── 3. Patent & IPR ──
  if (cat.includes('patent') || type.includes('patent') || cat.includes('ipr')) {
    if (lower.includes('draft') || lower.includes('specification')) {
      return {
        required: true,
        proofType: 'patent_draft',
        label: 'Patent Specification Document',
        hint: 'Upload technical patent draft document.',
      };
    }
    if (lower.includes('apply') || lower.includes('application') || lower.includes('filing')) {
      return {
        required: true,
        proofType: 'application_acknowledgement',
        label: 'Patent Application Acknowledgement',
        hint: 'Upload official Indian Patent Office Form 1/CBR receipt.',
      };
    }
    if (lower.includes('publish') || lower.includes('journal')) {
      return {
        required: true,
        proofType: 'journal_publication',
        label: 'Patent Journal Publication Record',
        hint: 'Upload official patent journal gazette screenshot.',
      };
    }
    if (lower.includes('grant') || lower.includes('granted')) {
      return {
        required: true,
        proofType: 'grant_certificate',
        label: 'Patent Grant Certificate',
        hint: 'Upload official Patent Grant Certificate from IPO.',
      };
    }
  }

  // ── 4. Technical / Hackathon / Competitions ──
  if (cat.includes('tech') || type.includes('hackathon') || type.includes('comp') || type.includes('project')) {
    if (lower.includes('register') || lower.includes('registration')) {
      return {
        required: true,
        proofType: 'registration_confirmation',
        label: 'Registration Confirmation / Ticket',
        hint: 'Upload ticket, registration confirmation email, or portal confirmation.',
      };
    }
    if (lower.includes('prototype') || lower.includes('build') || lower.includes('complete project')) {
      return {
        required: true,
        proofType: 'prototype_evidence',
        label: 'Prototype Output / GitHub Screenshot',
        hint: 'Upload working prototype photo or GitHub repository screenshot.',
      };
    }
    if (lower.includes('participate') || lower.includes('present') || lower.includes('presentation')) {
      return {
        required: true,
        proofType: 'participation_proof',
        label: 'Event Participation Proof / Photo',
        hint: 'Upload event attendance badge, presentation photo, or certificate.',
      };
    }
    if (lower.includes('finalist') || lower.includes('shortlist')) {
      return {
        required: true,
        proofType: 'finalist_announcement',
        label: 'Official Finalist Announcement / Email',
        hint: 'Upload official finalist list screenshot or announcement email.',
      };
    }
    if (lower.includes('win') || lower.includes('winner') || lower.includes('runner') || lower.includes('award')) {
      return {
        required: true,
        proofType: 'winner_certificate',
        label: 'Winner Certificate / Result Notification',
        hint: 'Upload winner/merit certificate or official podium result.',
      };
    }
  }

  // ── 5. Certifications & Online Courses ──
  if (cat.includes('cert') || type.includes('cert') || type.includes('course') || type.includes('nptel')) {
    if (lower.includes('enroll') || lower.includes('enrolled')) {
      return {
        required: true,
        proofType: 'enrollment_screenshot',
        label: 'Course Enrollment Confirmation',
        hint: 'Upload course portal dashboard screenshot showing active enrollment.',
      };
    }
    if (lower.includes('50%') || lower.includes('progress') || lower.includes('module')) {
      return {
        required: true,
        proofType: 'progress_screenshot',
        label: 'Course Progress Screenshot',
        hint: 'Upload screenshot showing completed course modules.',
      };
    }
    if (lower.includes('complete') || lower.includes('finish')) {
      return {
        required: true,
        proofType: 'completion_screenshot',
        label: 'Course Completion Screenshot',
        hint: 'Upload 100% course completion screen.',
      };
    }
    if (lower.includes('assessment') || lower.includes('exam') || lower.includes('test')) {
      return {
        required: true,
        proofType: 'assessment_result',
        label: 'Assessment Score Card / Result',
        hint: 'Upload passing grade scorecard or assessment result.',
      };
    }
    if (lower.includes('certificate') || lower.includes('certified')) {
      return {
        required: true,
        proofType: 'certificate_document',
        label: 'Official Certificate Document',
        hint: 'Upload verified certificate PDF or high-resolution image.',
      };
    }
  }

  // ── 6. Sports & Athletics ──
  if (cat.includes('sport') || type.includes('tournament') || type.includes('athletic')) {
    if (lower.includes('register') || lower.includes('team entry')) {
      return {
        required: true,
        proofType: 'team_registration',
        label: 'Team Entry / Registration Confirmation',
        hint: 'Upload official team registration or chest number card.',
      };
    }
    if (lower.includes('participate') || lower.includes('round 1') || lower.includes('quarter')) {
      return {
        required: true,
        proofType: 'participation_proof',
        label: 'Participation Certificate / Match Proof',
        hint: 'Upload participation certificate or tournament photo.',
      };
    }
    if (lower.includes('final') || lower.includes('semi')) {
      return {
        required: true,
        proofType: 'fixture_result',
        label: 'Official Fixture / Match Result',
        hint: 'Upload official tournament scorecard or fixture confirmation.',
      };
    }
    if (lower.includes('win') || lower.includes('winner') || lower.includes('runner') || lower.includes('medal')) {
      return {
        required: true,
        proofType: 'winner_certificate',
        label: 'Winner Certificate / Medal Photo',
        hint: 'Upload winner/runner-up certificate or award citation.',
      };
    }
  }

  // ── 7. Cultural & Co-Curricular ──
  if (cat.includes('cultural') || type.includes('fest') || type.includes('mime') || type.includes('dance')) {
    if (lower.includes('register')) {
      return {
        required: true,
        proofType: 'registration_confirmation',
        label: 'Fest Registration Confirmation',
        hint: 'Upload fest registration slip or confirmation.',
      };
    }
    if (lower.includes('participate') || lower.includes('perform')) {
      return {
        required: true,
        proofType: 'performance_photo',
        label: 'Participation Certificate / Stage Photo',
        hint: 'Upload event participation certificate or performance photo.',
      };
    }
    if (lower.includes('win') || lower.includes('winner') || lower.includes('runner') || lower.includes('place')) {
      return {
        required: true,
        proofType: 'winner_certificate',
        label: 'Winner Certificate / Trophy Photo',
        hint: 'Upload prize winner certificate or medal photo.',
      };
    }
  }

  // ── 8. Entrepreneurship & Startups ──
  if (cat.includes('entrepreneur') || type.includes('startup') || type.includes('incubation')) {
    if (lower.includes('business model') || lower.includes('pitch deck') || lower.includes('deck')) {
      return {
        required: true,
        proofType: 'pitch_deck',
        label: 'Pitch Deck / Business Model Document',
        hint: 'Upload business model document or deck PDF.',
      };
    }
    if (lower.includes('apply') || lower.includes('application')) {
      return {
        required: true,
        proofType: 'application_acknowledgement',
        label: 'Incubation / Grant Application Proof',
        hint: 'Upload incubator portal application receipt.',
      };
    }
    if (lower.includes('pitch') || lower.includes('interview')) {
      return {
        required: true,
        proofType: 'pitch_confirmation',
        label: 'Pitch Session Confirmation / Photo',
        hint: 'Upload pitch schedule email or presentation photo.',
      };
    }
    if (lower.includes('select') || lower.includes('fund') || lower.includes('grant') || lower.includes('approved')) {
      return {
        required: true,
        proofType: 'selection_letter',
        label: 'Official Incubation / Grant Approval Letter',
        hint: 'Upload official selection or grant approval letter.',
      };
    }
  }

  // ── 9. Leadership & Student Responsibility ──
  if (cat.includes('leader') || type.includes('coordinator') || type.includes('representative')) {
    if (lower.includes('nominate') || lower.includes('apply')) {
      return {
        required: true,
        proofType: 'nomination_form',
        label: 'Nomination Form / Application Proof',
        hint: 'Upload completed nomination form or application proof.',
      };
    }
    if (lower.includes('appoint') || lower.includes('select') || lower.includes('elected')) {
      return {
        required: true,
        proofType: 'appointment_letter',
        label: 'Official Appointment / Selection Letter',
        hint: 'Upload official appointment circular or letter.',
      };
    }
    if (lower.includes('event') || lower.includes('conduct') || lower.includes('lead')) {
      return {
        required: true,
        proofType: 'event_report',
        label: 'Event Report / Leadership Activity Photo',
        hint: 'Upload event circular, report, or coordinating photo.',
      };
    }
    if (lower.includes('tenure') || lower.includes('complete') || lower.includes('service')) {
      return {
        required: true,
        proofType: 'leadership_certificate',
        label: 'Leadership Certificate / Service Letter',
        hint: 'Upload completed tenure certificate from faculty incharge.',
      };
    }
  }

  // ── 10. Social Impact / Community Service ──
  if (cat.includes('social') || cat.includes('community') || type.includes('nss') || type.includes('blood')) {
    if (lower.includes('participate') || lower.includes('volunteer') || lower.includes('drive')) {
      return {
        required: true,
        proofType: 'activity_photo',
        label: 'Activity / Service Action Photo',
        hint: 'Upload activity photo or coordinator signature.',
      };
    }
    if (lower.includes('complete') || lower.includes('donor') || lower.includes('certificate')) {
      return {
        required: true,
        proofType: 'donor_certificate',
        label: 'Participation / Donor Certificate',
        hint: 'Upload official blood donor certificate or NSS participation certificate.',
      };
    }
  }

  // ── 11. Awards & Recognition ──
  if (cat.includes('award') || type.includes('recognition')) {
    if (lower.includes('nominate') || lower.includes('apply')) {
      return {
        required: true,
        proofType: 'nomination_proof',
        label: 'Nomination / Recommendation Proof',
        hint: 'Upload department nomination or endorsement letter.',
      };
    }
    if (lower.includes('shortlist') || lower.includes('interview')) {
      return {
        required: true,
        proofType: 'shortlist_announcement',
        label: 'Shortlist Announcement',
        hint: 'Upload shortlist announcement circular or email.',
      };
    }
    if (lower.includes('award') || lower.includes('receive') || lower.includes('winner')) {
      return {
        required: true,
        proofType: 'award_certificate',
        label: 'Award Certificate / Official Citation',
        hint: 'Upload award citation, certificate, or medal photo.',
      };
    }
  }

  // Fallback default
  return DEFAULT_REQUIRED_PROOF;
}
