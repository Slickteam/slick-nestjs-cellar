# @slickteam/nestjs-cellar

[![npm version](https://img.shields.io/npm/v/@slickteam/nestjs-cellar.svg)](https://www.npmjs.com/package/@slickteam/nestjs-cellar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Module NestJS pour intégrer facilement [Cellar](https://www.clever-cloud.com/product/cellar/), le service de stockage S3 de Clever Cloud.

## Installation

```bash
npm install @slickteam/nestjs-cellar
# ou
pnpm add @slickteam/nestjs-cellar
```

## Configuration

Ajoutez les variables d'environnement suivantes :

| Variable                    | Requis | Défaut | Description                            |
| --------------------------- | ------ | ------ | -------------------------------------- |
| `CELLAR_HOST`               | Oui    | -      | Endpoint Cellar                        |
| `CELLAR_KEY_ID`             | Oui    | -      | Access Key ID                          |
| `CELLAR_KEY_SECRET`         | Oui    | -      | Secret Access Key                      |
| `CELLAR_REGION`             | Non    | `fr`   | Région du bucket                       |
| `CELLAR_TIMEOUT_SIGNED_URL` | Non    | `3600` | Durée de validité des URLs signées (s) |

Exemple de fichier `.env` :

```env
CELLAR_HOST=cellar-c2.services.clever-cloud.com
CELLAR_KEY_ID=votre_key_id
CELLAR_KEY_SECRET=votre_key_secret
CELLAR_REGION=fr
CELLAR_TIMEOUT_SIGNED_URL=3600
```

## Utilisation

### Import du module

```ts
import { CellarModule } from '@slickteam/nestjs-cellar';

@Module({
  imports: [CellarModule],
})
export class AppModule {}
```

### Injection du service

```ts
import { CellarService } from '@slickteam/nestjs-cellar';

@Injectable()
export class MyService {
  constructor(private readonly cellarService: CellarService) {}

  async uploadDocument(file: Express.Multer.File) {
    return this.cellarService.uploadFile('mon-bucket', file);
  }
}
```

## API

### `CellarService`

| Méthode                   | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `listObjectsByBucketName` | Liste les objets d'un bucket                    |
| `uploadFile`              | Upload un fichier dans un bucket                |
| `getFile`                 | Récupère un fichier depuis un bucket            |
| `deleteFile`              | Supprime un fichier d'un bucket                 |
| `fileExists`              | Vérifie l'existence d'un fichier                |
| `getSignedUrl`            | Génère une URL signée pour accéder à un fichier |

### Propriétés exposées

- `s3Client` : Instance du client S3 pour des opérations avancées
- `s3EndPoint` : URL de l'endpoint Cellar
- `timeoutSignedUrl` : Durée de validité des URLs signées

## Dépendances

| Package                         | Version  |
| ------------------------------- | -------- |
| `@nestjs/common`                | `^11.0`  |
| `@nestjs/config`                | `^4.0`   |
| `@aws-sdk/client-s3`            | `^3.980` |
| `@aws-sdk/s3-request-presigner` | `^3.980` |

## Licence

MIT
