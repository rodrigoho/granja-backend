import * as Yup from 'yup';
import CargoPacking from '../models/CargoPacking';
import Customer from '../models/Customer';

class CargoPackingController {
  async index(req, res) {
    const cargoPackings = await CargoPacking.findAll({
      attributes: [
        'state',
        'city',
        'address',
        'eggs_cargo',
        'cargo_packing_number',
        // 'icms_tax',
        // 'insurance_fee',
        // 'name',
        // 'discount_price',
        // 'rural_fund_discount',
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

    const result = cargoPackings.map((cP) => {
      const total_cargo_price = cP.eggs_cargo.reduce(
        (acc, egg) => acc + egg.price * egg.qty,
        0
      );

      const total_cargo_boxes = cP.eggs_cargo.reduce(
        (acc, egg) => acc + egg.qty,
        0
      );

      const icms_value =
        cP.customer.icms_tax *
        cP.eggs_cargo.reduce((acc, egg) => acc + egg.qty, 0) *
        0.07;

      const customer_name = cP.customer.name;
      return {
        virtualData: {
          total_cargo_price,
          customer_name,
          total_cargo_boxes,
          icms_value,
        },
        data: cP,
      };
    });
    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      state: Yup.string().required(),
      city: Yup.string().required(),
      address: Yup.string().required(),
      eggs_cargo: Yup.array().required(),
      cargo_packing_number: Yup.number().required(),
      customer_id: Yup.number().required(),
      // icms_tax: Yup.number().required(),
      // insurance_fee: Yup.number().required(),
      // name: Yup.string().required(),
      // discount_price: Yup.number().required(),
      // rural_fund_discount: Yup.number().required(),
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
      state,
      city,
      address,
      eggs_cargo,
      cargo_packing_number,
      // icms_value,
      // icms_tax,
      // insurance_fee,
      // name,
      // discount_price,
      // rural_fund_discount,
    } = req.body;

    await CargoPacking.create({
      id,
      state,
      city,
      address,
      eggs_cargo,
      cargo_packing_number,
      // icms_value,
      // icms_tax,
      // insurance_fee,
      // name,
      // discount_price: discount_price * 100,
      // rural_fund_discount,
    });

    return res.json({
      id,
      state,
      city,
      address,
      eggs_cargo,
      cargo_packing_number,
      // icms_tax,
      // insurance_fee,
      // name,
      // discount_price,
      // rural_fund_discount,
    });
  }
}

export default new CargoPackingController();
