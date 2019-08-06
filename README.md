# `@webcarrot/copy-declaration-ts`

Copy `*.d.ts` files from source directory into build/dist directory

## Instalation

Global:

`npm i -g @webcarrot/copy-declaration-ts`

or local:

`npm i --save-dev @webcarrot/copy-declaration-ts`

## Usage

Global installation usage:

`copy-declaration-ts ./src ./dist/foo`

Local installation usage:

In `package.json`:

```json
{
  "scripts": {
    "build": "tsc && copy-declaration-ts ./src ./dit/foo"
  },
  "devDependencies": {
    "@webcarrot/copy-declaration-ts": "^1.0.0"
  }
}
```

and then:

`npm run build`
