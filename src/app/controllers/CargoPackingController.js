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
        'is_paid',
        'due_to',
        'has_insurance_fee',
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
      'has_insurance_fee',
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
        'is_paid',
        'due_to',
        'has_insurance_fee',
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
        has_insurance_fee: hasInsuranceFee,
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

      const totalEggsCargoPrice = +orderItems
        .reduce((acc, egg) => acc + egg.cur_egg_price * egg.amount, 0)
        .toFixed(2);
      const insurancePrice = hasInsuranceFee
        ? +((totalEggsCargoPrice / 0.85) * 0.01).toFixed(2)
        : 0;
      const icmsFee = +(totalBoxesAmount * icmsTax * 0.07).toFixed(2);
      const discountValue = discount * totalBoxesAmount;

      const ruralFundFee = fundoRuralTax
        ? +(receiptValue * fundoRuralTax * 0.01).toFixed(2)
        : 0;

      const balanceDue = +(
        totalEggsCargoPrice +
        icmsFee +
        insurancePrice -
        ruralFundFee
      ).toFixed(2);
      return {
        cargoPacking,
        cargoVirtualData: {
          totalBoxesAmount,
          totalEggsCargoPrice,
          balanceDue,
          insurancePrice,
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
      is_paid: Yup.boolean().required(),
      due_to: Yup.date().required(),
      eggs_cargo: Yup.array(),
      has_insurance_fee: Yup.boolean(),
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
      where: { receipt_number: req.body.receipt_number },
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
      is_paid,
      eggs_cargo,
      created_by_user_id,
      updated_by_user_id,
      has_insurance_fee,
      due_to,
      customer_id,
      receipt_value,
      receipt_number,
    } = req.body;

    await CargoPacking.create({
      is_paid,
      has_insurance_fee,
      due_to,
      eligible_for_analysis: eligibeForAnalysis,
      customer_id,
      created_by_user_id,
      updated_by_user_id,
      receipt_value,
      receipt_number,
    });

    const currentCargoPacking = await CargoPacking.findOne({
      where: { receipt_number: req.body.receipt_number },
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

  async update(req, res) {
    const schema = Yup.object().shape({
      is_paid: Yup.boolean().required(),
      due_to: Yup.date().required(),
      eggs_cargo: Yup.array(),
      has_insurance_fee: Yup.boolean(),
      receipt_number: Yup.number().required(),
      receipt_value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { is_admin: isAdmin } = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res
        .status(401)
        .json({ error: `You need admin privilege to edit an egg` });
    }

    const {
      id,
      eggs_cargo,
      is_paid,
      has_insurance_fee,
      receipt_value,
      receipt_number,
      created_by_user_id,
    } = req.body;
    const cargoPacking = await CargoPacking.findByPk(req.params.id);

    const updatedCargoPacking = {
      id,
      eggs_cargo,
      is_paid,
      has_insurance_fee,
      receipt_value,
      receipt_number,
      created_by_user_id,
      updated_by_user_id: req.userId,
    };

    eggs_cargo.forEach(async (egg) => {
      try {
        const orderItemToUpdate = await OrderItem.findOne({
          where: {
            cargo_packing_id: req.params.id,
            egg_id: egg.egg_id,
          },
        });

        await orderItemToUpdate.update({
          amount: egg.amount,
        });
      } catch (err) {
        console.log(err);
      }
    });

    await cargoPacking.update(updatedCargoPacking);

    return res.json({
      updatedCargoPacking,
    });
  }
}

export default new CargoPackingController();
