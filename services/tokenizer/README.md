Tokenizer
===


### About
Tokenizes a string and replaces special characters with standard ones e.g `é` :arrow_right: `e`.

### Usage
```
POST http://localhost:8001/tokenize json '{
  "data": "Quand il est plein, le loup-garou se réveillera et trouvera son bien-aimé",
  "language": "fr"
}'
```

#### Output
```
{
  "words": [
    "quand", 
    "il", 
    "est", 
    "plein", 
    ",", 
    "le", 
    "loup", 
    "-", 
    "garou", 
    "se", 
    "reveillera", 
    "et", 
    "trouvera", 
    "son", 
    "bien", 
    "-", 
    "aime"
  ]
}
```
