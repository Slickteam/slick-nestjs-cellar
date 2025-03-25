# Slick Nestjs Cellar

Available on npmjs.org : [@slickteam/nestjs-cellar](https://www.npmjs.com/package/@slickteam/nestjs-cellar)

## Usage

- Install dependency

```bash
npm i -S @slickteam/nestjs-cellar
```

- In your environment file, add these lines :

```conf
CELLAR_ADDON_HOST=cellar-c2.services.clever-cloud.com
CELLAR_ADDON_KEY_ID=
CELLAR_ADDON_KEY_SECRET=
CELLAR_ADDON_REGION=fr
CELLAR_ADDON_TIMEOUT_SIGNED_URL=3600
```

- In module where you want use this module, add this :

```ts
@Module({
  imports: [CellarModule],
  controllers: [],
  providers: [],
  exports: [],
})
class ExempleModule {}
```

## Dependencies version

Nestjs

- `@nestjs/common`: `^11.0.12`
- `@nestjs/config`: `^4.0.1`

Cellar (AWS)

- `@aws-sdk/client-s3`: `^3.774.0`
- `@aws-sdk/s3-request-presigner`: `^3.774.0`
