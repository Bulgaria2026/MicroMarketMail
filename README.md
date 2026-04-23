# MicroMarketMail

Transactional email templates for MicroMarket, authored in [React Email](https://react.email/) and published as a Maven JAR of Thymeleaf-ready HTML for the backend.

## Develop

```bash
bun install
bun run dev      # preview at http://localhost:3000
bun run export   # render to out/*.html
```

Templates live in `emails/`. Thymeleaf helpers (`thText`, `thEach`, `thIf`, `thRemove`) are in `emails/lib/thymeleaf.ts`.

## Publish

Every push to `develop` publishes `com.noserbulgaria.micromarket:email-templates:<package.json version>-SNAPSHOT` to GitHub Packages. Version is bumped in `package.json`.

Backend loads templates from the classpath:

```java
getResourceAsStream("/email-templates/order-confirmation.html");
```
