# WebStore Web API application

The application is a SPA that provides the ability to:
1)	Manage (Create, Update, Delete, Sort, View) goods and commodities in warehouse of the application by a salesperson.
2)	Register in an account base for a user.
3)	Change/restore password.
4)	Manage users and roles registered in the application by an administrator.
5)	Manage user’s orders and shopping cart by a user.
6)	Accept or decline user’s orders by a salesperson.

## Contains:

1) Catalog view.
2) Cart view.
3) Orders view.
4) Users view.
5) Login view.
6) Registration view.
6) Account view.

## Frontend

### Technology stack:

- All technology stack of Vue：[vue](https://vuejs.org/) + [vuex](https://vuex.vuejs.org/ru/guide/) + [vue-router](https://router.vuejs.org/ru/) + [Webpack](https://webpack.js.org/)
- ES6
- SCSS (SASS)

### Plugins:

- [Vuetify](https://vuetifyjs.com/ru/)
- [Axios](https://github.com/axios/axios)
- [ESLint](https://eslint.org/)

### Coding standards:

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/)

### Start Dev Server

```
npm run serve
```

### Produces a production-ready bundle in the dist/ directory

```
npm run build
```

### Produces a production-ready bundle in the dist/ directory and start Node server

```
npm run build:all
```

## Backend

### Technology stack:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Plugins:

- [Express](https://expressjs.com/)
- [nodemon](https://nodemon.io/)
- [multer](https://github.com/expressjs/multer/)
- [nodemailer](https://nodemailer.com/)

### Classes:

1) Main.
2) Db.
3) Carts. 
4) Catalog.
5) Orders.
6) Users.

### API:

```
/carts
    /                   :get
    /change             :post    
    /delete             :post  
/catalog
    /                   :get  
    /create             :post  
    /delete             :post  
    /edit               :post  
/orders
    /                   :get  
    /create             :post  
    /change-status      :post  
/users
    /                   :get  
    /create             :post  
    /delete             :post  
    /edit               :post 
    /disable            :post 
    /restore            :post 
    /restore-password   :post 
    /login              :get 
    /change-password    :post  
```

### Config:

Contains login and password to connect to MongoDb.

### Start Dev Server

```
npm run dev
```

### Start Prod Server

```
npm run start
```

### Start Dev Server for Windows

```
npm run dev:windows
```

### Start Prod Server for Windows

```
npm run start:windows
```



