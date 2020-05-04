import * as Yup from 'yup';
import CargoPacking from '../models/CargoPacking';
import Customer from '../models/Customer';
import OrderItem from '../models/OrderItem';
import Egg from '../models/Egg';

class CargoPackingController {
  async index(req, res) {
    const cargoPackings = await CargoPacking.findAll({
      attributes: [
        'id',
        'cargo_packing_number',
        'cargo_packing_status',
        'due_to',
        'created_by',
        'updated_by',
        'insurance_fee',
        'customer_id',
      ],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: [
            'name',
            'cnpj',
            'phone',
            'email',
            'discount',
            'has_fundo_rural',
            'icms_tax',
            'zip_code',
            'address',
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
      due_to: Yup.date().required(),
      customer_id: Yup.number().required(),
      created_by: Yup.string().required(),
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
      created_by,
      updated_by,
      insurance_fee,
      due_to,
      customer_id,
    } = req.body;

    await CargoPacking.create({
      cargo_packing_number,
      cargo_packing_status,
      insurance_fee,
      due_to,
      customer_id,
      created_by,
      updated_by,
    });

    const currentCargoPacking = await CargoPacking.findOne({
      where: { cargo_packing_number: req.body.cargo_packing_number },
    });

    eggs_cargo.forEach(async (egg) => {
      try {
        const currentEgg = await Egg.findOne({
          where: { id: egg.egg_id },
        });
        await OrderItem.create({
          cargo_packing_id: currentCargoPacking.id,
          egg_id: egg.egg_id,
          amount: egg.amount,
          cur_egg_price: currentEgg.price,
        });
      } catch (err) {
        console.log(err);
      }
    });

    return res.json({
      id,
      cargo_packing_number,
      cargo_packing_status,
      eggs_cargo,
      due_to,
      customer_id,
      created_by,
      updated_by,
    });
  }
}

export default new CargoPackingController();
