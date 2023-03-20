export const ClassificationEnum = {
  0: "LABEL_SIMPLE_CLASSIFICATION",
  1: "LABEL_MULTI_LABEL_CLASSIFICATION",
  2: "LABEL_SEQUENCE_CLASSIFICATION"
};

export const SentimentEnum = {
  0: "LABEL_SENTIMENT_DATA"
};

export const NewsStateENum = Object.freeze({
  0: "TEXT_EN_ATTENTE_DAFFECTATION",
  AFFECTATION: {
    key: "AFFECTATION",
    label: "TEXT_EN_ATTENTE_DAFFECTATION",
    value: 0
  },
  1: "TEXT_EN_ATTENTE_DE_VÉRIFICATION",
  VERIFICATION: {
    key: "VERIFICATION",
    label: "TEXT_EN_ATTENTE_DE_VÉRIFICATION",
    value: 1
  },
  2: "TEXT_EN_ATTENTE_DE_VALIDATION",
  VALIDATION: {
    key: "VALIDATION",
    label: "TEXT_EN_ATTENTE_DE_VALIDATION",
    value: 2
  },
  3: "TEXT_VALIDÉ",
  PUBLICATION: {
    key: "PUBLICATION",
    label: "TEXT_VALIDÉ",
    value: 3
  },
  4: "TEXT_PUBLIÉ",
  ARCHIVED: {
    key: "ARCHIVED",
    label: "TEXT_PUBLIÉ",
    value: 4
  },
  5: "TEXT_NON_APPROUVÉE",
  NON_APPROUVER: {
    key: "NON_APPROUVER",
    label: "TEXT_NON_APPROUVÉE",
    value: 5
  }
});

export const infractionStatusEnum = Object.freeze({
  NO_INFRACTION: 0,
  INFRACTION_A_VALIDER: 1,
  INFRACTION_VALIDE: 2
});

export const infractionsEnum = Object.freeze({
  A: 0,
  B: 1,
  C: 2
});

export const DecisionEnum = Object.freeze({
  0: "TEXT_VÉRIFIÉ_COMME_FAKENEWS",
  CORRECT: {
    label: "TEXT_VÉRIFIÉ_COMME_FAKENEWS",
    value: 0
  },
  1: "TEXT_NEST_PAS_FAKENEWS",
  FALSE: {
    label: "TEXT_NEST_PAS_FAKENEWS",
    value: 1
  },
  2: "TEXT_ON_NE_PEUT_PAS_CONFIRMER",
  MAYBE: {
    label: "TEXT_ON_NE_PEUT_PAS_CONFIRMER",
    value: 2
  },
  3: "TEXT_INEXACTE",
  INEXACT: {
    label: "TEXT_INEXACTE",
    value: 3
  },
  4: "TEXT_SARCASTIQUE",
  SARCASTIC: {
    label: "TEXT_SARCASTIQUE",
    value: 4
  },
  5: "TEXT_PROVOCATION",
  PROVOCATION: {
    label: "TEXT_PROVOCATION",
    value: 5
  },
  6: "TEXT_MYTHE",
  MYTH: {
    label: "TEXT_MYTHE",
    value: 6
  }
});
export const PrioriteEnum = Object.freeze({
  FAIBLE: {
    key: "FAIBLE",
    label: "TEXT_FAIBLE",
    value: 0
  },
  MOYENNE: {
    key: "MOYENNE",
    label: "TEXT_MOYENNE",
    value: 1
  },
  IMPORTANTE: {
    key: "IMPORTANTE",
    label: "TEXT_IMPORTANTE",
    value: 2
  }
});

export const ImpactEnum = Object.freeze({
  FAIBLE: {
    key: "FAIBLE",
    label: "TEXT_FAIBLE",
    value: 0
  },
  MOYEN: {
    key: "MOYENNE",
    label: "TEXT_MOYENNE",
    value: 1
  },
  IMPORTANT: {
    key: "IMPORTANT",
    label: "TEXT_IMPORTANTE",
    value: 2
  }
});
export const StatusEnum = Object.freeze({
  1: "TEXT_EN_ATTENTE_DE_VALIDATION",
  DONE: {
    label: "TEXT_EN_ATTENTE_DE_VALIDATION",
    value: 1
  },
  2: "TEXT_VALIDÉ",
  VALIDATED: {
    label: "TEXT_VALIDÉ",
    value: 2
  },
  [-1]: "TEXT_ABONDONNÉ",
  CANCELED: {
    label: "TEXT_ABONDONNÉ",
    value: -1
  },
  0: "TEXT_ENATTENTE",
  NONE: {
    label: "TEXT_ENATTENTE",
    value: 0
  }
});
export const ImportanceEnum = Object.freeze({
  0: "TEXT_FAIBLE",
  FAIBLE: {
    label: "TEXT_FAIBLE",
    value: 0
  },
  1: "TEXT_MOYENNE",
  MOYENNE: {
    label: "TEXT_MOYENNE",
    value: 1
  },
  2: "TEXT_IMPORTANTE",
  IMPORTANTE: {
    label: "TEXT_IMPORTANTE",
    value: 2
  }
});
export const NewsTypeEnum = Object.freeze({
  PRESSE: 0,
  TERRAIN: 1
});

export const infractionEnum = Object.freeze({
  NO_INFRACTION: 0,
  INFRACTION_A_VALIDER: 1,
  INFRACTION_VALIDE: 2
});

export const RolesEnum = Object.freeze({
  JOURNALISTE: {
    key: "JOURNALISTE",
    label: "TEXT_JOURNALISTE",
    value: 0
  },
  MONITEUR: {
    key: "MONITEUR",
    label: "TEXT_MONITEUR",
    value: 1
  },
  SUPERMONITEUR: {
    key: "SUPERMONITEUR",
    label: "TEXT_SUPER_MONITEUR",
    value: 2
  },
  DECIDEUR: {
    key: "DECIDEUR",
    label: "TEXT_DÉCIDEUR",
    value: 3
  },
  ADMINISTRATEUR: {
    key: "ADMINISTRATEUR",
    label: "TEXT_ADMINISTRATEUR",
    value: 4
  }
});
export const UserStatusEnum = Object.freeze({
  ACTIVE: {
    key: "ACTIVE",
    label: "LABEL_COMPTE_ACTIF",
    value: 1
  },
  NON_ACTIVE: {
    key: "NON_ACTIVE",
    label: "LABEL_COMPTE_INNACTIF",
    value: 0
  },
  BANNED: {
    key: "BANNED",
    label: "LABEL_COMPTE_BANNI",
    value: -1
  }
});

export function getKeyByValue(object, value, label = null, key = null, search) {
  let result = null;
  Object.values(object).forEach(item => {
    if (value != null && item.value === value) result = item[search];
    else if (label != null && item.label === label) result = item[search];
    else if (key != null && item.key === key) result = item[search];
  });
  return result;
}
