import * as Yup from 'yup';
import CargoPacking from '../models/CargoPacking';
import Customer from '../models/Customer';
import OrderItem from '../models/OrderItem';
// import Egg from '../models/Egg';

class CargoPackingController {
  async index(req, res) {
    const cargoPackings = await CargoPacking.findAll({
      attributes: [
        'state',
        'city',
        'address',
        'eggs_cargo',
        'cargo_packing_number',
      ],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: [
            'name',
            'discount',
            'address',
            'icms_tax',
            'insurance_fee',
            'discount_price',
            'rural_fund_discount',
          ],
        },
      ],
    });
    // .sort({ createdAt: 'desc' })
    // .limit(20);

    return res.json(cargoPackings);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      cargo_packing_number: Yup.number().required(),
      cargo_packing_status: Yup.boolean().required(),
      eggs_cargo: Yup.array().required(),
      due_to: Yup.date().required(),
      customer_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const cargoPackingExists = await CargoPacking.findOne({
      where: { cargo_packing_number: req.body.cargo_packing_number },
    });

    if (cargoPackingExists) {
      return res.status(400).json({ error: 'Cargo packing already exists.' });
    }

    const {
      id,
      cargo_packing_number,
      cargo_packing_status,
      eggs_cargo,
      due_to,
      customer_id,
    } = req.body;

    eggs_cargo.forEach((egg) => {
      OrderItem.create({
        cargo_packing_id: id,
        egg_id: egg.id,
        amount: egg.qty,
        cur_egg_price: 10,
      });
    });

    await CargoPacking.create({
      cargo_packing_number,
      cargo_packing_status,
      due_to,
      customer_id,
    });

    return res.json({
      id,
      cargo_packing_number,
      cargo_packing_status,
      eggs_cargo,
      due_to,
      customer_id,
    });
  }
}

export default new CargoPackingController();
