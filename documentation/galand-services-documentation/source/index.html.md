# Introduction

host = http://test.botv.io:88

# NEWS

- **/api/manager/news**

## ENUMS

| Parameter  | Description                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Priority   | FAIBLE : 0, MOYENNE : 1, IMPORTANTE : 2                                                                                              |
| Impact     | FAIBLE : 0, MOYENNE : 1, IMPORTANTE : 2                                                                                              |
| Status     | EN ATTENTE DAFFECTATION : 0, EN ATTENTE DE VÉRIFICATION : 1, EN ATTENTE DE VALIDATION : 2, VALIDÉ : 3, PUBLIÉ : 4, NON APPROUVÉE : 5 |
| Infraction | NO INFRACTION: 0, INFRACTION A VALIDER: 1,INFRACTION VALIDE: 2                                                                       |

## Filters Explanation

- Filters

| Parameter | Description                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------- |
| after     | greater or equal than (Exp : "after_created" : "1592265600000" creation date greater than 16/06)  |
| before    | smaller or equal than (Exp : "before_created" : "1592265600000" creation date smaller than 16/06) |
| multi     | multi search (Exp : "multi_priority": [0, 2] get news where priority is equal to 0 or 2)          |
| all       | all search (Exp : "all_text": "Hello" get news where text contains "Hello")                       |
| equal     | (Exp : "equal_text": "Hello" get news where text is equal to "Hello")                             |
| like      | (Exp : "like_text": "Hello" get news where text is like "Hello")                                  |
| regexp    | search by regex expression (Exp : "regex_projectId": ".+" search where projectId != "" )          |

- Sort :

| Parameter | Description |
| --------- | ----------- |
| asc       | asending    |
| desc      | descending  |

## GET **/assigned**

- Get all news assigned to the authenticated user

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/added**

- Get all news added by the authenticated user

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/all**

- Get all fakenews

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/projects**

- Get all news from all projects

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/projects/:projectId**

- Get all news from a specific project

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| ProjectId | id          |

## GET **/:newsId**

- Get a specific news

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| newsId    | id          |

## GET **/required-actions**

- Get all todo actions of the authenticated user

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/description**

- Get all News Keys used in sorting

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/:newsId/changes**

- Get a specific news history of changes

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| newsId    | id          |

## POST **/projects/search?page=0&size=10&append=false**

- Search For Articles in a Project

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description   |
| --------- | ------------- |
| Page      | number (OPT)  |
| Size      | number (OPT)  |
| Append    | boolean (OPT) |

> BODY EXEMPLE

```json
{
  "filter": {
    "all_text": "TEXT_TO_SEARCH",
    "multi_priority": [0, 2],
    "musonlti_impact": [0, 2],
    "after_created": "0", //Date
    "before_created": 1590969600000, //Date
    "multi_subjects": ["5e4c06639758c11d3c97c836", "5ede63f42e99fef702f60aec"], //SUBJECTS IDs
    "multi_categories": [
      "5ebd0f99ed3bd46e736d8ebd",
      "5ede640cc72b43c9a4aa5865"
    ], //CATEGORIES IDs
    "multi_status": [0, 1]
  },
  "moreLike": {
    "like": "WORD",
    "fields": ["title"], // title,text ....
    "max_query_terms": 30,
    "min_word_length": 4,
    "min_term_freq": "5",
    "min_doc_freq": 1
  },
  "sort": [
    { "key": "categories.keyword", "order": "asc" },
    { "key": "additionalLinks.keyword", "order": "desc" }
  ]
}
```

## POST **/all/search?page=0&size=10&append=false**

- Search For Articles in Fakenews

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "filter": {
    "all_text": "TEXT_TO_SEARCH",
    "multi_priority": [0, 2],
    "musonlti_impact": [0, 2],
    "after_created": "0", //Date
    "before_created": 1590969600000, //Date
    "multi_subjects": ["5e4c06639758c11d3c97c836", "5ede63f42e99fef702f60aec"], //SUBJECTS IDs
    "multi_categories": [
      "5ebd0f99ed3bd46e736d8ebd",
      "5ede640cc72b43c9a4aa5865"
    ], //CATEGORIES IDs
    "multi_status": [0, 1]
  },
  "moreLike": {
    "like": "WORD",
    "fields": ["title"], // title,text ....
    "max_query_terms": 30,
    "min_word_length": 4,
    "min_term_freq": "5",
    "min_doc_freq": 1
  },
  "sort": [
    { "key": "categories.keyword", "order": "asc" },
    { "key": "additionalLinks.keyword", "order": "desc" }
  ]
}
```

**URL Parameters**

| Parameter | Description   |
| --------- | ------------- |
| Page      | number (OPT)  |
| Size      | number (OPT)  |
| Append    | boolean (OPT) |

## POST **/added/search?page=0&size=10&append=false**

- Search For Articles added by the authenticated user

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "filter": {
    "all_text": "TEXT_TO_SEARCH",
    "multi_priority": [0, 2],
    "musonlti_impact": [0, 2],
    "after_created": "0", //Date
    "before_created": 1590969600000, //Date
    "multi_subjects": ["5e4c06639758c11d3c97c836", "5ede63f42e99fef702f60aec"], //SUBJECTS IDs
    "multi_categories": [
      "5ebd0f99ed3bd46e736d8ebd",
      "5ede640cc72b43c9a4aa5865"
    ], //CATEGORIES IDs
    "multi_status": [0, 1]
  },
  "moreLike": {
    "like": "WORD",
    "fields": ["title"], // title,text ....
    "max_query_terms": 30,
    "min_word_length": 4,
    "min_term_freq": "5",
    "min_doc_freq": 1
  },
  "sort": [
    { "key": "categories.keyword", "order": "asc" },
    { "key": "additionalLinks.keyword", "order": "desc" }
  ]
}
```

**URL Parameters**

| Parameter | Description   |
| --------- | ------------- |
| Page      | number (OPT)  |
| Size      | number (OPT)  |
| Append    | boolean (OPT) |

## POST **/assigned/search?page=0&size=10&append=false**

- Search For Articles assigned by the authenticated user

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "filter": {
    "all_text": "TEXT_TO_SEARCH",
    "multi_priority": [0, 2],
    "musonlti_impact": [0, 2],
    "after_created": "0", //Date
    "before_created": 1590969600000, //Date
    "multi_subjects": ["5e4c06639758c11d3c97c836", "5ede63f42e99fef702f60aec"], //SUBJECTS IDs
    "multi_categories": [
      "5ebd0f99ed3bd46e736d8ebd",
      "5ede640cc72b43c9a4aa5865"
    ], //CATEGORIES IDs
    "multi_status": [0, 1]
  },
  "moreLike": {
    "like": "WORD",
    "fields": ["title"], // title,text ....
    "max_query_terms": 30,
    "min_word_length": 4,
    "min_term_freq": "5",
    "min_doc_freq": 1
  },
  "sort": [
    { "key": "categories.keyword", "order": "asc" },
    { "key": "additionalLinks.keyword", "order": "desc" }
  ]
}
```

**URL Parameters**

| Parameter | Description   |
| --------- | ------------- |
| Page      | number (OPT)  |
| Size      | number (OPT)  |
| Append    | boolean (OPT) |

## POST **/\*/search**

- Fix Filters Format passed to in the request body before continuing to searh

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "filter": {}
}
```

## POST **/projects/count**

- Count Articles existing in Projects using Filter passed in the request body

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{ "filter": {} }
```

### POST **/all/count**

- Count Fakenews using Filter passed in the request body

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "filter": {}
}
```

## DELETE **/:newsId**

- Delete a specific news

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| newsId    | id          |

## PUT **/:newsId**

- Update a specific news

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "id": "5ee25fe0e64c7a381fdca40e",
  "title": "newest",
  "link": "https://www.linkedin.com/in/jawher-hamza/",
  "newsType": 0,
  "subjects": ["5ede63f42e99fef702f60aec", "5e4c06639758c11d3c97c836"],
  "categories": ["5ede640cc72b43c9a4aa5865"],
  "reliability": 0,
  "additionalLinks": ["https://www.linkedin.com/in/jawher-hamza/"],
  "videoUrl": "https://www.linkedin.com/in/jawher-hamza/",
  "text": "DESC",
  "userCoverImage": [],
  "infraction": {
    "status": 0,
    "infractionType": "",
    "comment": "",
    "link": "",
    "files": [],
    "responsible": "",
    "confirmComment": ""
  },
  "communication": { "decision": 0, "text": "", "links": [] },
  "impact": 0,
  "priority": 0,
  "monitor": "5d55e3f00000000000000da5",
  "lastModified": 1591895370648,
  "created": 1591893984933,
  "creator": "5d55e3f00000000000000da5",
  "creatorInfo": {
    "lName": "Admin",
    "fName": "Default",
    "id": "5d55e3f00000000000000da5"
  },
  "status": 1,
  "files": [
    {
      "serverId": "36972d7b05d9a07b56367736b85d0d11",
      "filename": "HAICA SPECS.pdf",
      "fileType": "application/pdf",
      "fileSize": 1012402
    }
  ],
  "originalArticle": "",
  "projectId": "",
  "formInfos": [],
  "media": "",
  "actionPlan": [],
  "comments": [],
  "videoTrackComments": [],
  "score": 1,
  "coverImage": "",
  "dueDate": "2020-07-21T12:00:00+01:00"
}
```

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| newsId    | id          |

## POST **/**

- Update a specific news

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "title": "LFC13",
  "link": "http://192.168.1.230/reusable-components/NLP/BotStudio/blob/master/services/galand-manager/models/News.js",
  "subjects": ["5e4e43f5877c43481fbfacdd"],
  "categories": ["5ebd0f99ed3bd46e736d8ebd"],
  "reliability": 0,
  "files": [
    {
      "serverId": "98027636f501c35c1305daa95dcf9caf",
      "filename": "exemple Infraction.pdf",
      "fileType": "application/pdf",
      "fileSize": 1012973
    }
  ],
  "additionalLinks": [
    "http://192.168.1.230/reusable-components/NLP/BotStudio/blob/master/services/galand-manager/models/News.js"
  ],
  "videoUrl": "http://192.168.1.230/reusable-components/NLP/BotStudio/blob/master/services/galand-manager/models/News.js",
  "text": "DESC",
  "monitor": "5d55e3f00000000000000da5",
  "dueDate": "2020-07-13T12:00:00+01:00",
  "projectId": "5d55vcdegfzer0erg4er68" // in case adding to a project
}
```

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| newsId    | id          |

# FEED

- **/api/manager/feed**

## ENUMS

| Enum     | Description                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Priority | FAIBLE:0, MOYENNE:1, IMPORTANTE:2                                                                                        |
| Impact   | FAIBLE:0, MOYENNE:1, IMPORTANTE:2                                                                                        |
| Status   | EN ATTENTE DAFFECTATION:0, EN ATTENTE DE VÉRIFICATION:1, EN ATTENTE DE VALIDATION:2, VALIDÉ:3, PUBLIÉ:4, NON APPROUVÉE:5 |

## PS

| Prefix | Description                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------- |
| after  | greater or equal than (Exp : "after_created" : "1592265600000" creation date greater than 16/06)  |
| before | smaller or equal than (Exp : "before_created" : "1592265600000" creation date smaller than 16/06) |
| multi  | multi search (Exp : "multi_priority": [0, 2] get news where priority is equal to 0 or 2)          |
| all    | all search (Exp : "all_text": "Hello" get news where text contains "Hello")                       |
| equal  | (Exp : "equal_text": "Hello" get news where text is equal to "Hello")                             |
| like   | (Exp : "like_text": "Hello" get news where text is like "Hello")                                  |
| regexp | search by regex expression (Exp : "regex_projectId": ".+" search where projectId != "" )          |

- Sort :

| Value | Description                                                      |
| ----- | ---------------------------------------------------------------- |
| asc   | asending EXP : "sort": [{ "key": "created", "order": "asc" }]    |
| desc  | descending EXP : "sort": [{ "key": "created", "order": "desc" }] |

### POST **/search?page=0&size=10&append=false**

- Search For Feeds

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description   |
| --------- | ------------- |
| Page      | number (OPT)  |
| Size      | number (OPT)  |
| Append    | boolean (OPT) |

> BODY EXEMPLE

```json
{
  "filter": {
    "multi_source": ["twitter", "instagram"],
    "multi_media": ["5ed4e5eef1442430af669c77"],
    "after_created": 1591743600000,
    "before_created": 1592953200000,
    "like_author": "LFC"
  },
  "sort": [{ "key": "source.keyword", "order": "asc" }]
}
```

## GET **/?page=0&size=10&append=false**

- Search For Feeds

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description   |
| --------- | ------------- |
| Page      | number (OPT)  |
| Size      | number (OPT)  |
| Append    | boolean (OPT) |

### GET **/description**

- Get all News Keys (used in sorting)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/:feedId**

- Get a specific feed

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| feedId    | id          |

## GET **/display**

- Returns displays for each source (facebook, instagram ....)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| feedId    | id          |

## PUT **\***

- Update a the feed passed in the request body

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
"scrore_projet_x": 17101,
"updatedTime": 1591753802730,
"like_count": 29048,
"author": "LFC",
"custom_dictionary": { "CUST_corona": 0 },
"created": 1588327200000,
"language": "en",
"media": "5ed4e5eef1442430af669c77",
"source": "twitter",
"title": "It was a really difficult end to 2019 for season ticket holder, David Kerruish, so @JHenderson decided it was time… https://t.co/p1pG1mUZte",
"score": 2,
"userId": 19583545,
"retweet_count": 5155,
"url": "https://twitter.com/user/status/1256161439598800898",
"urls": "https://t.co/p1pG1mUZte<br />",
"firstCrawlTime": 1591753802497,
"text": "It was a really difficult end to 2019 for season ticket holder, David Kerruish, so @JHenderson decided it was time… https://t.co/p1pG1mUZte",
"occurences": null,
"id": "02d44239a48ca39fd1d48b62b4a43f19",
"selectedFor": [
{
"newsId": "5ee9f30cb7cc52a2f0aafb3c",
"newsTitle": "It was a really difficult end to 2019 for season ticket holder, David Kerruish, so @JHenderson decided it was time… https://t.co/p1pG1mUZte",
"type": "monitoring",
"name": "LFC"
}
]
```

# DICTIONARY

- **/api/manager/dictionaries**

## POST **/**

- Add a Dictionary
- **Permission** needed (P_DICTIONNARY > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{ "name": "Sports", "corpus": "ball foOtball basketball" }
```

## PUT **/:id**

- Update a Dictionary
- **Permission** needed (P_DICTIONNARY > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter     | Description |
| ------------- | ----------- |
| Dictionary Id | id          |

> BODY EXEMPLE

```json
{
  "name": "Sports",
  "corpus": "ball football basketball tennis",
  "_id": "5eea12981d58b5065c5269a3"
}
```

## DELETE **/:id**

- Delete a Dictionary
- **Permission** needed (P_DICTIONNARY > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter     | Description |
| ------------- | ----------- |
| Dictionary Id | id          |

# CUSTOM DICTIONARY

- **/api/manager/custom-dictionaries**

## POST **/**

- Add a Custom Dictionary
- **Permission** needed (P_DICTIONNARY > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "name": "Sports",
  "words": ["ball", "basketball", "football"]
}
```

## PUT **/:id**

- Update a Classification
- **Permission** needed (P_DICTIONNARY > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter            | Description |
| -------------------- | ----------- |
| Custom Dictionary Id | id          |

> BODY EXEMPLE

```json
{
  "name": "Sports",
  "words": ["ball", "basketball", "football"],
  "_id": "5eea12981d58b5065c5269a3"
}
```

## DELETE **/:id**

- Delete a Custom Dictionary
- **Permission** needed (P_DICTIONNARY > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter            | Description |
| -------------------- | ----------- |
| Custom Dictionary ID | id          |

# CLASSIFICATION

- **/api/manager/classification**

## ENUMS

| ClassificationEnum         | Value |
| -------------------------- | ----- |
| Classification Simple      | 0     |
| Multi Label Classification | 1     |
| Sequence Classification    | 2     |

## GET **/:id**

- Get a specific Classification
- **Permission** needed (P_CLASSIFICATION >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter         | Description |
| ----------------- | ----------- |
| Classification Id | id          |

## GET **/**

- Get All Classifications
- **Permission** needed (P_CLASSIFICATION >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## PUT **/:id**

- Update Classification
- **Permission** needed (P_CLASSIFICATION > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter         | Description |
| ----------------- | ----------- |
| Classification Id | id          |

> BODY EXEMPLE

```json
{
  "classificationType": "0",
  "created": 1590589515430,
  "lastModified": 1590589515430,
  "name": "CORONA",
  "trainingFiles": [],
  "\\_id": "5ece784bc81d3b057e14f51d"
}
```

## DELETE **/:id**

- Delete a Classification
- **Permission** needed (P_CLASSIFICATION > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter         | Description |
| ----------------- | ----------- |
| Classification ID | id          |

## POST **/**

- Add a Classification
- **Permission** needed (P_CLASSIFICATION > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{ "name": "Sports", "classificationType": "0", "trainingFiles": [] }
```

# PROJECTS

- **/api/manager/projects**

## GET **/**

- Get All Projects
- **Permission** needed (P_PROJECT >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## PUT **/:id**

- Update Project
- **Permission** needed (P_PROJECT > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter  | Description |
| ---------- | ----------- |
| Project ID | id          |

> BODY EXEMPLE

```json
{
  "_id": "5ed4e606c7fdf30f4edc406d",
  "title": "LFC",
  "theme": "TEST",
  "startProject": 1590966000000,
  "endProject": 1595372400000,
  "dictionaries": ["5eea12981d58b5065c5269a3"],
  "customDictionaries": ["5eea1367b3768509bbdeff60"],
  "customSearches": ["5ed4ea021a8be092c71cc7a9"],
  "models": ["5e665a0858ee2c71b5e56582"],
  "media": ["5ed4e5eef1442430af669c77", "5ede64af0bf97debf4b7032d"],
  "assignees": ["5d55e3f00000000000000da5"],
  "forms": []
}
```

## DELETE **/:id**

- Delete a Project
- **Permission** needed (P_PROJECT > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter  | Description |
| ---------- | ----------- |
| Project ID | id          |

## POST **/**

- Add a Project
- **Permission** needed (P_PROJECT > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "title": "LFC",
  "theme": "TEST",
  "startProject": 1590966000000,
  "endProject": 1595372400000,
  "dictionaries": ["5eea12981d58b5065c5269a3"],
  "customDictionaries": ["5eea1367b3768509bbdeff60"],
  "customSearches": ["5ed4ea021a8be092c71cc7a9"],
  "models": ["5e665a0858ee2c71b5e56582"],
  "media": ["5ed4e5eef1442430af669c77", "5ede64af0bf97debf4b7032d"],
  "assignees": ["5d55e3f00000000000000da5"],
  "forms": []
}
```

# MEDIA

- **/api/manager/media**

## GET **/**

- Get All Medias
- **Permission** needed (P_MEDIA >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## PUT **/:id**

- Update Media
- **Permission** needed (P_MEDIA > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter  | Description |
| ---------- | ----------- |
| Project ID | id          |

> BODY EXEMPLE

```json
{
  "_id": "5ed4e5eef1442430af669c77",
  "name": "LFC",
  "links": [
    {
      "schedule": "0 */30 * * * ? *",
      "source": "instagram",
      "url": "https://www.instagram.com/liverpoolfc/?hl=fr"
    },
    {
      "schedule": "0 */30 * * * ? *",
      "source": "facebook",
      "url": "https://www.facebook.com/LiverpoolFC/"
    },
    {
      "schedule": "0 */30 * * * ? *",
      "source": "twitter",
      "url": "https://twitter.com/lfc"
    },
    {
      "schedule": "0 */1 * * * ? *",
      "source": "youtube",
      "url": "https://www.youtube.com/user/LiverpoolFC"
    }
  ],
  "type": "Médias"
}
```

## DELETE **/:id**

- Delete a Media
- **Permission** needed (P_MEDIA > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| Media ID  | id          |

## POST **/**

- Add a Media
- **Permission** needed (P_MEDIA > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "name": "Obama",
  "type": "Politician",
  "links": [
    {
      "url": "https://twitter.com/barackobama",
      "source": "twitter",
      "schedule": "0 0 00 */1 * ? *" //cron task
    }
  ]
}
```

# TAGS

- **/api/manager/tags**

## GET **/**

- Get All Tags (Subjects and Categories)
- **Permission** needed (P_TAGS >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## PUT **/:id**

- Update a Tag
- **Permission** needed (P_TAGS > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| Tag ID    | id          |

> BODY EXEMPLE

```json
{
  "_id": "5ede63f42e99fef702f60aec",
  "label": "Football",
  "count": 42,
  "isCategory": false,
  "color": "#ffc0cb"
}
```

## DELETE **/:id**

- Delete a Tag
- **Permission** needed (P_TAGS > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| Tag ID    | id          |

## POST **/**

- Add a Tag
- **Permission** needed (P_TAGS > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "color": "#9b59b6",
  "label": "BlackLivesMatter",
  "isCategory": true //if it's a category
}
```

# CUSTOM SEARCH

- **/api/manager/custom-search**

## GET **/**

- Get All Custom Searches (Subjects and Categories)
- **Permission** needed (P_CUSTOM_SEARCH >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## PUT **/:id**

- Update a CS
- **Permission** needed (P_CUSTOM_SEARCH > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter      | Description |
| -------------- | ----------- |
| CustomSearchId | id          |

> BODY EXEMPLE

```json
{
  "_id": "5ede63f42e99fef702f60aec",
  "search": {
    "advancedFilter": { "after__score": "0" },
    "filter": {
      "multi_media": ["5ed4e5eef1442430af669c77"],
      "multi_source": ["twitter"],
      "after_created": 1592175600000
    },
    "sort": [{ "key": "created", "order": "desc" }]
  },
  "name": "lfc2",
  "searchType": "SCRAPPING" // CAN BE SCRAPPING OR FAKENEWS
}
```

## DELETE **/:id**

- Delete a CS
- **Permission** needed (P_CUSTOM_SEARCH > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter      | Description |
| -------------- | ----------- |
| CustomSearchId | id          |

## POST **/**

- Add a CS
- **Permission** needed (P_CUSTOM_SEARCH > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "search": {
    "advancedFilter": { "after__score": "0" },
    "filter": {
      "multi_media": ["5ed4e5eef1442430af669c77"],
      "multi_source": ["twitter"],
      "after_created": 1592175600000
    },
    "sort": [{ "key": "created", "order": "desc" }]
  },
  "name": "lfc2",
  "searchType": "SCRAPPING" // CAN BE SCRAPPING OR FAKENEWS
}
```

# FORM

- **/api/manager/form**

## GET **/**

- Get all Forms
- **Permission** needed (P_FORM >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

## GET **/:id**

- get a specific Form
- **Permission** needed (P_FORM >= 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| Form Id   | id          |

## POST **/**

- Add a Form
- **Permission** needed (P_FORM > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

> BODY EXEMPLE

```json
{
  "name": "FORM_NAME",
  "theme": "THEME",
  "title": "FORM",
  "inputs": [
    {
      "options": ["OP1", "OP2"],
      "name": "test",
      "label": "TEST",
      "placeholder": "TEST"
    }
  ]
}
```

## PUT **/:id**

- Update a Form
- **Permission** needed (P_FORM > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| Form Id   | id          |

> BODY EXEMPLE

```json
{
  "name": "FORM_NAME",
  "theme": "THEME",
  "title": "FORM",
  "inputs": [
    {
      "options": ["OP1", "OP2"],
      "name": "test",
      "label": "TEST",
      "placeholder": "TEST"
    }
  ]
}
```

## DELETE **/:id**

- Delete a Form
- **Permission** needed (P_FORM > 1)

**Headers**

| Parameter    | Description           |
| ------------ | --------------------- |
| Content-Type | application/json      |
| Cookie       | MUST BE AUTHENTICATED |

**URL Parameters**

| Parameter | Description |
| --------- | ----------- |
| Form ID   | id          |

---

title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ

- shell
- ruby
- python
- javascript

toc_footers:

- <a href='#'>Sign Up for a Developer Key</a>
- <a href='https://github.com/slatedocs/slate'>Documentation Powered by Slate</a>

includes:

- errors

# Authentication

> To authorize, use this code:

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
```

```shell
# With shell, you can just pass the correct header with each request
curl "api__here"
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require("kittn");

let api = kittn.authorize("meowmeowmeow");
```

> Make sure to replace `meowmeowmeow` with your API key.

Kittn uses API keys to allow access to the API. You can register a new Kittn API key at our [developer portal](http://example.com/developers).

Kittn expects for the API key to be included in all API requests to the server in a header that looks like the following:

`Authorization: meowmeowmeow`

<aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside>

# Kittens

## Get All Kittens

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get()
```

```shell
curl "http://example.com/api/kittens"
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require("kittn");

let api = kittn.authorize("meowmeowmeow");
let kittens = api.kittens.get();
```

> The above command returns JSON structured like this:

```json
[
  {
    "id": 1,
    "name": "Fluffums",
    "breed": "calico",
    "fluffiness": 6,
    "cuteness": 7
  },
  {
    "id": 2,
    "name": "Max",
    "breed": "unknown",
    "fluffiness": 5,
    "cuteness": 10
  }
]
```

This retrieves all kittens.

### HTTP Request

`GET http://example.com/api/kittens`

### URL Parameters

| Parameter    | Default | Description                                                                      |
| ------------ | ------- | -------------------------------------------------------------------------------- |
| include_cats | false   | If set to true, the result will also include cats.                               |
| available    | true    | If set to false, the result will include kittens that have already been adopted. |

<aside class="success">
Remember — a happy kitten is an authenticated kitten!
</aside>

## Get a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.get(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.get(2)
```

```shell
curl "http://example.com/api/kittens/2"
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require("kittn");

let api = kittn.authorize("meowmeowmeow");
let max = api.kittens.get(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

This retrieves a specific kitten.

<aside class="warning">Inside HTML code blocks like this one, you can't use Markdown, so use <code>&lt;code&gt;</code> blocks to denote code.</aside>

### HTTP Request

`GET http://example.com/kittens/<ID>`

### URL Parameters

| Parameter | Description                      |
| --------- | -------------------------------- |
| ID        | The ID of the kitten to retrieve |

## Delete a Specific Kitten

```ruby
require 'kittn'

api = Kittn::APIClient.authorize!('meowmeowmeow')
api.kittens.delete(2)
```

```python
import kittn

api = kittn.authorize('meowmeowmeow')
api.kittens.delete(2)
```

```shell
curl "http://example.com/api/kittens/2"
  -X DELETE
  -H "Authorization: meowmeowmeow"
```

```javascript
const kittn = require("kittn");

let api = kittn.authorize("meowmeowmeow");
let max = api.kittens.delete(2);
```

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "deleted": ":("
}
```

This deletes a specific kitten.

### HTTP Request

`DELETE http://example.com/kittens/<ID>`

### URL Parameters

| Parameter | Description                    |
| --------- | ------------------------------ |
| ID        | The ID of the kitten to delete |
