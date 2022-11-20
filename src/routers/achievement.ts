import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../mongoose/user'
import { APP_NAME_TOKEN } from '../const';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
export const userRouters = express.Router();

userRouters.get("/data", (_req, res) => {
  res.status(200).json({ message: "Fetch successfully", data: [] });
});

userRouters.post('/change', (req, res) => {
  // UserSchema.findOne({ email: req.body.email }).then(user => {
  //   if (user && req.body.email) {
  //     const password = '123456';
  //     const params = {
  //       to: req.body.email,
  //       password
  //     };
  //     emailjs.send('service_v17mx66', 'template_is53cop', params, 'user_RHbhBWi0166Xhqv2Nx7mm')
  //       .then((result: EmailJSResponseStatus) => {
  //         console.log(result.text);
  //         bcrypt.hash(password, 10)
  //           .then(hash => {
  //             user.password = hash;
  //             user.save().then(result => {
  //               res.status(200).json({ message: "Đổi mật khẩu thành công", data: [] });
  //             });
  //           })
  //           .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Save user' }));
  //       })
  //       .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Send email' }));
  //   } else {
  //     res.status(401).json({ message: "Email không đúng", data: 'Not found user' });
  //   }
  // })
  //   .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Find user error' }));
});

userRouters.post('/forgot', (req, res) => {
  UserSchema.findOne({ email: req.body.email }).then(user => {
    if (user && req.body.email) {
      const password = '123456';
      const params = {
        to: req.body.email,
        password
      };
      emailjs.send('service_v17mx66', 'template_is53cop', params, 'user_RHbhBWi0166Xhqv2Nx7mm')
        .then((result: EmailJSResponseStatus) => {
          bcrypt.hash(password, 10)
            .then(hash => {
              user.password = hash;
              user.save().then(result => {
                res.status(200).json({ message: "Đổi mật khẩu thành công", data: [] });
              });
            })
            .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Save user' }));
        })
        .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Send email' }));
    } else {
      res.status(401).json({ message: "Email không đúng", data: 'Not found user' });
    }
  })
    .catch(err => res.status(500).json({ message: "Lỗi server", data: 'Find user error' }));
});

userRouters.post('/signin', (req, res) => {
  UserSchema.findOne({ email: req.body.email }).then(user => {
    let token = '';
    if (user && bcrypt.compareSync(req.body.password, user?.password || '')) {
      token = jwt.sign({ email: user.email, userId: user._id }, APP_NAME_TOKEN, { expiresIn: "30d" });
    }
    res.status(token ? 200 : 401).json({ message: token ? "Đăng nhập thành công" : "Email hoặc mật khẩu không đúng", data: token || null });
  })
    .catch(err => res.status(500).json({ message: "Lỗi server", data: err }));
});

userRouters.post('/signup', async (req, res) => {
  // if (req.body.password !== req.body.rePassword) {
  //   return res.status(400).json({ message: "Nhập lại mật khẩu không khớp", data: null });
  // }
  const user = await UserSchema.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "Email đã tồn tại", data: null });
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        avatarUrl: req.body.avatar,
        birth: req.body.birth
      });
      user.save().then(result => {
        const token = jwt.sign({ email: user.email, userId: result._id }, APP_NAME_TOKEN, { expiresIn: "30d" });
        res.status(201).json({ message: "Đăng ký thành công", data: token });
      });
    })
    .catch(err => res.status(500).json({ message: "Lỗi server", data: err }));
});
