import Router from 'koa-router';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'koa-passport';
import tools from '../config/tools';
import { keys } from '../config/keys';

const router = new Router();

// 引入数据模型
import User from '../models/User';

// 引入input验证
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

/**
 * @route GET api/users/test
 * @dess 测试接口地址
 * @accsee 接口是公开的
 *  */
router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'users works...',
  };
});

/**
 * @route POST api/users/register
 * @dess 注册接口
 * @accsee 接口是公开的
 *  */

router.post('/register', async ctx => {
  // console.log(ctx.request.body);
  // 验证有效性
  const { errors, isValid } = validateRegisterInput(ctx.request.body);
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  // 查询数据库
  const findResult = await User.find({ email: ctx.request.body.email });
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = {
      msg: '邮箱已经被占用！',
    };
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: tools.enbcrypt(ctx.request.body.password),
      avatar,
    });

    // console.log(newUser);
    // 存储数据库
    await newUser
      .save()
      .then(user => {
        ctx.body = user;
      })
      .catch(err => {
        console.log(err);
      });

    // 返回Json数据
    // ctx.body = newUser;
    ctx.body = {
      data: 'success',
      msg: 'success',
      code: 1,
    };
  }
});

/**
 * @route POST api/users/login
 * @dess 登录接口,返回token
 * @accsee 接口是公开的
 *  */

router.post('/login', async ctx => {
  // 验证有效性
  const { errors, isValid } = validateLoginInput(ctx.request.body);
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  // 查询登录账号是否有效
  const findResult = await User.find({ email: ctx.request.body.email });
  const user = findResult[0];
  const password = ctx.request.body.password;
  if (findResult.length === 0) {
    ctx.status = 400;
    ctx.body = {
      msg: '用户不存在！',
    };
  } else {
    // 验证匹配密码
    const result = bcrypt.compareSync(password, user.password);

    if (result) {
      // 返回token
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      };
      const token = jwt.sign(payload, keys.secretOrKey, {
        expiresIn: 3600 * 24,
      });
      ctx.status = 200;
      ctx.body = {
        success: true,
        token: 'Bearer ' + token,
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        msg: '密码错误！',
      };
    }
  }
});

/**
 * @route GET api/users/current
 * @dess 用户信息接口
 * @accsee 接口是私密的
 *  */

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    ctx.status = 200;
    ctx.body = {
      id: ctx.state.user.id,
      name: ctx.state.user.name,
      email: ctx.state.user.email,
      avatar: ctx.state.user.avatar,
    };
  },
);

/**
 * @route GET api/users/current
 * @dess 用户信息接口
 * @accsee 用户列表
 *  */

router.get(
  '/list',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const findResult = await User.find((err, user) => {
      if (err) return console.error(err);
      delete user.password;
      return user;
    });
    // console.log(findResult);
    ctx.status = 200;
    ctx.body = {
      data: findResult,
    };
  },
);

/**
 * @route get api/users/delete
 * @dess 删除用户接口
 * @accsee 通用response
 */
router.get(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  async ctx => {
    const query = ctx.request.query;
    if (query.email) {
      const { deletedCount } = await User.remove(
        { email: query.email },
        err => {
          if (err) return console.error(err);
        },
			);
      ctx.status = deletedCount ? 200 : 400;
      ctx.body = {
        msg: deletedCount ? 'success' : '用户不存在',
        data: deletedCount,
        code: deletedCount ? 0 : 1,
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        msg: '请传入正确的邮箱！',
        data: 'fail',
        code: 1,
      };
    }
  },
);

export default router.routes();
