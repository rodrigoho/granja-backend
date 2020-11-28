import * as Yup from 'yup';
import Egg from '../models/Egg';
import EggPrice from '../models/EggPrice';
import User from '../models/User';

const { Op } = require('sequelize');

class EggPriceController {
  async createOrUpdate(req, res) {
    const schema = Yup.object().shape({
      egg_id_price: Yup.number().required(),
      price: Yup.number().required(),
      last_edited_by_user_id: Yup.number().required(),
      price_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const datePriceExists = await EggPrice.findOne({
      where: {
        egg_id_price: req.body.egg_id_price,
        price_date: req.body.price_date,
      },
    });

    console.log('opa');

    if (datePriceExists) {
      const { price } = req.body;
      const formattedPrice = parseFloat(price).toFixed(2);
      const updatedEgg = {
        price: formattedPrice,
        last_edited_by_user_id: req.userId,
      };
      const { id } = await datePriceExists.update(updatedEgg);

      return res.json({
        id,
        price,
        last_edited_by_user_id: req.userId,
      });
    }

    console.log('uepa');
    const {
      id,
      egg_id_price,
      price,
      last_edited_by_user_id,
      price_date,
    } = await EggPrice.create({
      ...req.body,
      price: parseFloat(req.body.price).toFixed(2),
    });

    return res.json({
      id,
      egg_id_price,
      price,
      last_edited_by_user_id,
      price_date,
    });
  }

  async index(req, res) {
    const eggs = await EggPrice.findAll({
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
    const whiteEggs = await EggPrice.findAll({
      order: [['price', 'DESC']],
      where: {
        [Op.or]: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
        ],
        // price_date: req.params.selected_date,
      },
      include: [
        {
          model: Egg,
          as: 'egg',
          attributes: ['size'],
        },
      ],
    });

    return res.json(whiteEggs);
  }

  async indexRed(req, res) {
    const redEggs = await EggPrice.findAll({
      order: [['price', 'DESC']],
      where: {
        [Op.or]: [
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
          { id: 11 },
          { id: 12 },
        ],
      },
      include: [
        {
          model: Egg,
          as: 'egg',
          attributes: ['size'],
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
    const eggs = await EggPrice.findByPk(req.params.id, {
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
    const egg = await EggPrice.findByPk(req.body.id);
    const formattedPrice = parseFloat(price).toFixed(2);
    const updatedEgg = {
      price: formattedPrice,
      last_edited_by_user_id: req.userId,
    };

    const { id } = await eggPrice.update(updatedEgg);

    return res.json({
      id,
      price,
      last_edited_by_user_id: req.userId,
    });
  }
}

export default new EggPriceController();
