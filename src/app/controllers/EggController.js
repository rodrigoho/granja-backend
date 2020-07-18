import * as Yup from 'yup';
import Egg from '../models/Egg';
import User from '../models/User';

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
    const eggs = await Egg.findAll({
      order: [['price', 'DESC']],
      include: [
        {
          model: User,
          as: 'edited_by_user',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(eggs);
  }

  async indexWhite(req, res) {
    const whiteEggs = await Egg.findAll({
      order: [['price', 'DESC']],
      where: {
        color: 'Branco',
      },
      include: [
        {
          model: User,
          as: 'edited_by_user',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(whiteEggs);
  }

  async indexRed(req, res) {
    const redEggs = await Egg.findAll({
      order: [['price', 'DESC']],
      where: {
        color: 'Vermelho',
      },
      include: [
        {
          model: User,
          as: 'edited_by_user',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(redEggs);
  }

  async filteredIndex(req, res) {
    const filterTypes = ['color', 'size', 'price', 'last_edited_by_user_id'];
    const { query } = req;

    // filter incorrect query
    Object.keys(query).forEach((key) => {
      if (!filterTypes.includes(key)) delete query[key];
    });
    const eggs = await Egg.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'edited_by_user',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(eggs);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // const { is_admin: isAdmin } = await User.findByPk(req.userId);

    // if (!isAdmin) {
    //   return res
    //     .status(401)
    //     .json({ error: `You need admin privilege to edit an egg` });
    // }

    const { price } = req.body;
    const egg = await Egg.findByPk(req.body.id);
    const formattedPrice = parseFloat(price).toFixed(2);
    const updatedEgg = {
      price: formattedPrice,
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
