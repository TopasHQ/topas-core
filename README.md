# Topas Core

![Topas City Logo](banner.jpeg)

# How to use

### Install dependencies

```
npm i
```

### Start the node

```
npm start
```

### Build project

Update types in `Socket` class `node_modules/lisk-framework/external_types/pm2-axon/index.d.ts` to:

```ts
		public on(name: string, val: any): this;
		public removeAllListeners(name?: string): this;
```

Then run:

```
npm run build
```

# License

[MIT](./LICENSE)
