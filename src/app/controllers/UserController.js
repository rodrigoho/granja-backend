import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      console.log(req.body);
      return res.status(400).json({ error: 'Validation fails' });
    }
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async indexById(req, res) {
    const user = await User.findByPk(req.params.id);

    return res.json(user);
  }

  async listUsers(req, res) {
    const users = await User.findAndCountAll({
      attributes: ['id', 'name', 'email'],
    });

    return res.json(users);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const {
      id,
      email,
      oldPassword,
      isAdmin,
      password,
      loggedUserId,
    } = req.body;

    const user = await User.findByPk(req.params.id);
    console.log(user);
    console.log('req.params.id', req.params);
    console.log('oldPassword', oldPassword);
    const test = await user.checkPassword(oldPassword);
    console.log('check', test);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    console.log(id);
    console.log(loggedUserId);

    if (loggedUserId === id || isAdmin === 'true') {
      console.log(`>>>>>>>>>`);
      console.log(email, password);
      await user.update({
        email,
        password,
      });
      return res.json({
        user,
        oldPassword,
        password,
      });
    }

    // const { name, avatar } = await User.findByPk(req.userId, {
    //   include: [
    //     {
    //       model: File,
    //       as: 'avatar',
    //       attributes: ['id', 'path', 'url'],
    //     },
    //   ],
    // });

    return res.status(403).send({ error: 'Erro ao trocar a senha' });
  }
}

export default new UserController();
