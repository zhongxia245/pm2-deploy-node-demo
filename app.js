const app = require("koa")();
const logger = require("koa-logger");
const json = require("koa-json");
const views = require("koa-views");
const onerror = require("koa-onerror");

const index = require("./routes/index");
const users = require("./routes/users");

// error handler
onerror(app);

// global middlewares
app.use(
  views("views", {
    root: __dirname + "/views",
    default: "jade"
  })
);
app.use(require("koa-bodyparser")());
app.use(json());
app.use(logger());

// add jwt middlewares
// app.use((ctx, next) => {
//   next().catch(err => {
//     if (err.status === 401) {
//       ctx.status = 401;
//       ctx.body = {
//         data: null,
//         message: "token无效",
//         status: false
//       };
//     } else {
//       throw err;
//     }
//   });
// });

// app.use(
//   koaJwt({ secret: "WFT_DSA" }).unless({
//     path: [
//       /^\/api\/users\/login/,
//       /^\/api\/users\/register/,
//       /^\/api\/users\/getSMS/,
//       /^\/api\/users\/forget/
//     ]
//   })
// );

app.use(function*(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log("%s %s - %s", this.method, this.url, ms);
});

app.use(require("koa-static")(__dirname + "/public"));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
