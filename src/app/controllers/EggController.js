import * as Yup from 'yup';
import Egg from '../models/Egg';
import User from '../models/User';

class EggController {
  async store(req, res) {
    const schema = Yup.object().shape({
      color: Yup.string().required(),
      size: Yup.string().required(),
      price: Yup.number().required(),
      last_edited_by_user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const eggExists = await Egg.findOne({
      where: {
        size: req.body.size,
        color: req.body.color,
      },
    });

    if (eggExists) {
      return res.status(400).json({ error: 'Egg already exists.' });
    }

    const { id, color, size, price, last_edited_by_user_id } = await Egg.create(
      req.body
    );

    return res.json({
      id,
      color,
      size,
      price,
      last_edited_by_user_id,
    });
  }

  async index(req, res) {
    const eggs = await Egg.findAll({
      include: [
        {
          model: User,
          as: 'edited_by_user',
          attributes: ['name', 'email'],
        },
      ],
    });
    // console.log(req.userId);

    return res.json(eggs);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number(),
      price: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { price } = req.body;
    const egg = await Egg.findByPk(req.body.id);

    const updatedEgg = {
      price,
      last_edited_by_user_id: req.userId,
    };

    const { id } = await egg.update(updatedEgg);

    return res.json({
      id,
      price,
      last_edited_by_user_id: req.userId,
    });
  }
}

export default new EggController();
