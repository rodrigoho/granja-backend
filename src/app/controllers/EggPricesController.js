import * as Yup from 'yup';
import { format } from 'date-fns';
import Egg from '../models/Egg';
import User from '../models/User';
import EggPrices from '../models/EggPrices';

class EggController {
  async store(req, res) {
    const schema = Yup.object().shape({
      color: Yup.string().required(),
      size: Yup.string().required(),
      price: Yup.number().required(),
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
      {
        ...req.body,
        price: parseFloat(req.body.price).toFixed(2),
        last_edited_by_user_id: req.userId,
      }
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
    const eggs = await EggPrices.findAll({
      order: [['price_date', 'DESC']],
      where: { price_date: req.body.selected_date },
      attributes: ['egg_id', 'price_date', 'cur_egg_price'],
      include: [
        {
          model: Egg,
          as: 'egg',
          attributes: ['size', 'color'],
        },
      ],
    });

    return res.json(eggs);
  }

  async indexSelected(req, res) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n<<<<<<<<<<<<<<<<<<\n\n',
      req.body
    );
    const eggs = await EggPrices.findAll({
      order: [['price_date', 'DESC']],
      where: { price_date: req.body.selected_date },
      attributes: ['egg_id', 'price_date', 'cur_egg_price'],
      include: [
        {
          model: Egg,
          as: 'egg',
          attributes: ['size', 'color'],
        },
      ],
    });

    const teste = eggs.filter((egg) => egg.egg.color === 'Vermelho');
    console.log(JSON.stringify(teste));
    return res.json(eggs);
  }
}

export default new EggController();
