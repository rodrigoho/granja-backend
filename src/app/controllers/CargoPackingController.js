import * as Yup from 'yup';
import CargoPacking from '../models/CargoPacking';
import Customer from '../models/Customer';
import OrderItem from '../models/OrderItem';
import Egg from '../models/Egg';
import User from '../models/User';

class CargoPackingController {
  async indexAll(req, res) {
    const cargoPackings = await CargoPacking.findAll({
      attributes: [
        'cargo_packing_number',
        'is_paid',
        'due_to',
        'insurance_fee',
        'receipt_number',
        'customer_id',
      ],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name'],
        },
      ],
    });

    return res.json(cargoPackings);
  }

  async filteredByCustomer(req, res) {
    const filterTypes = [
      'is_paid',
      'due_to',
      'insurance_fee',
      'eligible_for_analysis',
    ];
    const { query } = req;

    // filter incorrect query
    Object.keys(query).forEach((key) => {
      if (!filterTypes.includes(key)) delete query[key];
    });
    const customerCargoPackings = await CargoPacking.findAll({
      where: { ...req.params, ...query },
      attributes: [
        'id',
        'cargo_packing_number',
        'is_paid',
        'due_to',
        'insurance_fee',
        'eligible_for_analysis',
        'receipt_value',
        'receipt_number',
        'created_by_user_id',
        'updated_by_user_id',
        'customer_id',
      ],
      include: [
        {
          model: User,
          as: 'created_by_user',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'updated_by_user',
          attributes: ['name', 'email'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['name', 'discount', 'rural_fund_tax', 'icms_tax'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['amount', 'cur_egg_price'],
          include: [
            {
              model: Egg,
              as: 'egg_details',
              attributes: ['color', 'size'],
            },
          ],
        },
      ],
    });

    const result = customerCargoPackings.map((cargoPacking) => {
      const {
        order_items: orderItems,
        receipt_value: receiptValue,
      } = cargoPacking;

      const {
        icms_tax: icmsTax,
        rural_fund_tax: fundoRuralTax,
        discount,
      } = cargoPacking.customer;

      const totalBoxesAmount = orderItems.reduce(
        (acc, egg) => acc + egg.amount,
        0
      );

      const totalEggsCargoPrice = parseFloat(
        orderItems
          .reduce((acc, egg) => acc + egg.cur_egg_price * egg.amount, 0)
          .toFixed(2)
      );

      const insuranceFee = parseFloat(
        ((totalEggsCargoPrice / 0.85) * 0.01).toFixed(2)
      );
      const icmsFee = totalBoxesAmount * icmsTax * 0.07;
      const discountValue = discount * totalBoxesAmount;

      const ruralFundFee = fundoRuralTax
        ? parseFloat((receiptValue * fundoRuralTax * 0.01).toFixed(2))
        : 0;

      const balanceDue = parseFloat(
        (totalEggsCargoPrice + icmsFee + insuranceFee - ruralFundFee).toFixed(2)
      );
      return {
        cargoPacking,
        cargoVirtualData: {
          totalBoxesAmount,
          totalEggsCargoPrice,
          balanceDue,
          insuranceFee,
          icmsFee,
          ruralFundFee,
          discountValue,
        },
      };
    });

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      cargo_packing_number: Yup.number().required(),
      is_paid: Yup.boolean().required(),
      due_to: Yup.date().required(),
      insurance_fee: Yup.number(),
      customer_id: Yup.number().required(),
      created_by_user_id: Yup.number().required(),
      receipt_number: Yup.number().required(),
      receipt_value: Yup.number().required(),
    });

    let eligibeForAnalysis = false;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const cargoPackingExists = await CargoPacking.findOne({
      where: { cargo_packing_number: req.body.cargo_packing_number },
    });

    if (cargoPackingExists) {
      return res.status(400).json({ error: 'Cargo packing already exists.' });
    }
    const dueCargoPacking = await CargoPacking.findOne({
      where: { customer_id: req.body.customer_id, is_paid: false },
    });

    if (dueCargoPacking) {
      eligibeForAnalysis = true;
    }

    const {
      id,
      cargo_packing_number,
      is_paid,
      eggs_cargo,
      created_by_user_id,
      updated_by_user_id,
      insurance_fee,
      due_to,
      customer_id,
      receipt_value,
      receipt_number,
    } = req.body;

    await CargoPacking.create({
      cargo_packing_number,
      is_paid,
      insurance_fee,
      due_to,
      eligible_for_analysis: eligibeForAnalysis,
      customer_id,
      created_by_user_id,
      updated_by_user_id,
      receipt_value,
      receipt_number,
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
      is_paid,
      eligible_for_analysis: eligibeForAnalysis,
      eggs_cargo,
      due_to,
      customer_id,
      created_by_user_id,
      updated_by_user_id,
      receipt_value,
      receipt_number,
    });
  }
}

export default new CargoPackingController();
