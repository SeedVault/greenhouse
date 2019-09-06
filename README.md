# SEED Greenhouse

## Project setup

1. Install project dependencies:

```bash
npm install
```

2. Create a symlink to the `.env` file located in the dev-environment folder:

```bash
ln -s ../dev-environment/.env
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Add to pm2
```
pm2 start ecosystem.config.js --env development
```