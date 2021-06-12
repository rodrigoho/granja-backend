import * as Yup from 'yup';
// import { format } from 'date-fns';
import Egg from '../models/Egg';
// import User from '../models/User';
import EggPrices from '../models/EggPrices';

class EggPricesController {
  async store(req, res) {
    const schema = Yup.object().shape({
      egg_id: Yup.number().required(),
      cur_egg_price: Yup.number().required(),
      price_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    console.log(req.body);

    // return {};
    // const newDate = format(new Date(), 'dd/MM/yyyy');
    const { cur_egg_price, egg_id, price_date } = req.body;
    const formattedPrice = parseFloat(cur_egg_price).toFixed(2);

    // const eggPriceToSave = await EggPrices.findOne({
    //   where: {
    //     egg_id,
    //     price_date,
    //   },
    // });

    // if (eggPriceToSave) {
    //   return res.status(400).json({ error: 'Egg price already exists.' });
    // }

    await EggPrices.create({
      egg_id,
      cur_egg_price: formattedPrice,
      price_date,
    });

    return res.json({
      egg_id,
      cur_egg_price: formattedPrice,
      price_date,
    });
  }

  async update(req, res) {
    const { cur_egg_price, egg_id, price_date, egg_price_id } = req.body;
    const formattedPrice = parseFloat(cur_egg_price).toFixed(2);

    console.log(cur_egg_price, egg_id, price_date, egg_price_id);

    const eggPriceToSave = await EggPrices.findOne({
      where: {
        id: egg_price_id,
      },
    });

    const updatedEggPrice = {
      ...eggPriceToSave,
      cur_egg_price: formattedPrice,
    };

    await eggPriceToSave.update(updatedEggPrice);

    return res.json({
      egg_id,
      cur_egg_price: formattedPrice,
      price_date,
    });
  }

  async indexSelected(req, res) {
    const eggs = await EggPrices.findAll({
      order: [['price_date', 'DESC']],
      where: { price_date: req.body.selected_date },
      attributes: ['egg_id', 'price_date', 'cur_egg_price', 'id'],
      include: [
        {
          model: Egg,
          as: 'egg',
          attributes: ['size', 'color'],
        },
      ],
    });

    const eggsList = eggs.map((egg) => {
      const eggToAdd = {
        egg_price_id: egg.id,
        id: egg.egg_id,
        color: egg.egg.color,
        size: egg.egg.size,
        price: egg.cur_egg_price,
      };

      return eggToAdd;
    });

    return res.json(eggsList);
  }
}

export default new EggPricesController();
