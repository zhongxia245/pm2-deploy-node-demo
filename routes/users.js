var router = require("koa-router")();

router.prefix("/users");

router.get("/", async function(next) {
  this.body = "this is a users response!";
});

router.get("/bar", async function(next) {
  this.body = "this is a users/bar response!";
});

router.get("/login", async function(next) {
  this.body = "login";
});

router.get("/register", async function(next) {
  this.body = "register";
});

module.exports = router;
