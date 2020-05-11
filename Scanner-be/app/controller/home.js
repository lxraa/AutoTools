'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx,service } = this;
    let res = await ctx.service.home.index();
    ctx.body = res.test;
  }
  async test() {
    const {ctx} = this;
    ctx.body = "123";
  }
}

module.exports = HomeController;