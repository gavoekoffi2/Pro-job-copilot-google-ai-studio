const EMPTY_PERSONAL = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  linkedin: '',
  summary: '',
};

function text(value) {
  return value == null ? '' : String(value).trim();
}

function normalize(value) {
  return text(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9@.+#'/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value) {
  return normalize(value).replace(/[^a-z0-9]/g, '');
}

function isGrounded(value, sourceNormalized, sourceCompact) {
  const candidate = normalize(value);
  if (!candidate || candidate.length < 2) return false;
  if (sourceNormalized.includes(candidate)) return true;

  // Les téléphones, e-mails et URL changent souvent seulement d'espacement ou de ponctuation.
  const compactCandidate = compact(candidate);
  return compactCandidate.length >= 5 && sourceCompact.includes(compactCandidate);
}

function keep(value, sourceNormalized, sourceCompact) {
  const clean = text(value);
  return isGrounded(clean, sourceNormalized, sourceCompact) ? clean : '';
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Supprime tout champ structuré qui n'est pas explicitement présent dans la
 * transcription source. Cette étape est déterministe : l'IA ne peut donc pas
 * injecter une entreprise, un diplôme ou une compétence absente du CV.
 */
export function groundExtractedCV(candidate, sourceText) {
  const sourceNormalized = normalize(sourceText);
  const sourceCompact = compact(sourceText);
  const groundedValue = (value) => keep(value, sourceNormalized, sourceCompact);
  const personal = candidate?.personalInfo || {};

  const experiences = list(candidate?.experiences)
    .map((experience) => {
      const grounded = {
        title: groundedValue(experience?.title),
        company: groundedValue(experience?.company),
        location: groundedValue(experience?.location),
        startDate: groundedValue(experience?.startDate),
        endDate: groundedValue(experience?.endDate),
        current:
          Boolean(experience?.current) &&
          /\b(en cours|actuel(?:le)?|present|présent|currently|ongoing)\b/i.test(sourceText),
        description: groundedValue(experience?.description),
      };
      return grounded;
    })
    .filter((experience) => experience.title || experience.company || experience.description);

  const education = list(candidate?.education)
    .map((item) => ({
      degree: groundedValue(item?.degree),
      school: groundedValue(item?.school),
      location: groundedValue(item?.location),
      year: groundedValue(item?.year),
      description: groundedValue(item?.description),
    }))
    .filter((item) => item.degree || item.school || item.description);

  const skills = list(candidate?.skills)
    .map((skill) => ({
      name: groundedValue(typeof skill === 'string' ? skill : skill?.name),
      level: groundedValue(typeof skill === 'string' ? '' : skill?.level),
    }))
    .filter((skill) => skill.name);

  const languages = list(candidate?.languages)
    .map((language) => ({
      name: groundedValue(typeof language === 'string' ? language : language?.name),
      level: groundedValue(typeof language === 'string' ? '' : language?.level),
    }))
    .filter((language) => language.name);

  const certifications = list(candidate?.certifications)
    .map((certification) => ({
      name: groundedValue(certification?.name),
      issuer: groundedValue(certification?.issuer),
      year: groundedValue(certification?.year),
    }))
    .filter((certification) => certification.name);

  const interests = list(candidate?.interests)
    .map(groundedValue)
    .filter(Boolean);

  return {
    personalInfo: Object.fromEntries(
      Object.keys(EMPTY_PERSONAL).map((key) => [key, groundedValue(personal[key])]),
    ),
    experiences,
    education,
    skills,
    languages,
    certifications,
    interests,
  };
}
