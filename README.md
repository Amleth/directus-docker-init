# API

## Obtenir un token

```curl -X POST -H "Content-Type: application/json" --data '{"email": "thomas.bottini@cnrs.fr", "password": "coincoin"}' http://localhost:8055/timbres/auth/login```

## Insérer un item

curl -X POST -H "Content-Type: application/json" --data '{"machin": "Troisième", "id": "575d06e9-634a-4d3a-8d47-c4ef2563cf28"}' http://localhost:8055/timbres/items/trucs?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTlmOWEwLTU5YzYtNDM2ZC1iY2IxLTU2OWNmNGMzZWRmOCIsImlhdCI6MTYxMTgyNzg2OCwiZXhwIjoxNjExODI4NzY4fQ.VgvEtRshF-FSGdduQN9k70SCWd62DPLSzwfezC2vZCk

## Insérer un item avec un lien vers un autre item existant (M2O)

curl -X POST -H "Content-Type: application/json" --data '{"id": "3922c5aa-517e-4f26-ae01-2710bf0fe3ef", "truc": "575d06e9-634a-4d3a-8d47-c4ef2563cf28"}' http://localhost:8055/timbres/items/bidules?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTlmOWEwLTU5YzYtNDM2ZC1iY2IxLTU2OWNmNGMzZWRmOCIsImlhdCI6MTYxMTgyNzg2OCwiZXhwIjoxNjExODI4NzY4fQ.VgvEtRshF-FSGdduQN9k70SCWd62DPLSzwfezC2vZCk

## Mettre à jour un item

curl -X PATCH -H "Content-Type: application/json" --data '{"machin": "Nouvelle valeur"}' http://localhost:8055/timbres/items/trucs/575d06e9-634a-4d3a-8d47-c4ef2563cf28?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYTlmOWEwLTU5YzYtNDM2ZC1iY2IxLTU2OWNmNGMzZWRmOCIsImlhdCI6MTYxMTgyNzg2OCwiZXhwIjoxNjExODI4NzY4fQ.VgvEtRshF-FSGdduQN9k70SCWd62DPLSzwfezC2vZCk
