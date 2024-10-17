# Slick Nestjs Cellar

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

- `@nestjs/common`: `^10.4.5`
- `@nestjs/config`: `^3.2.3`

Cellar (AWS)

- `@aws-sdk/client-s3`: `^3.673.0`
- `@aws-sdk/s3-request-presigner`: `^3.673.0`
