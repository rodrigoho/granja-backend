import * as Yup from 'yup';
import CargoPacking from '../models/CargoPacking';
import Customer from '../models/Customer';
import IntermediaryCustomer from '../models/IntermediaryCustomer';
import OrderItem from '../models/OrderItem';
import Egg from '../models/Egg';
import User from '../models/User';
// import Notification from '../schemas/Notification';

class CargoPackingController {
  async indexAll(req, res) {
    const { page = 1 } = req.query;

    const cargoPackings = await CargoPacking.findAndCountAll({
      limit: 9,
      offset: (page - 1) * 9,
      order: [['due_to', 'ASC']],
      attributes: [
        'id',
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
          include: [
            {
              model: IntermediaryCustomer,
              as: 'intermediary',
              attributes: ['name', 'email', 'phone'],
            },
          ],
        },
      ],
    });

    return res.json(cargoPackings);
  }

  async filteredById(req, res) {
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
    const cargoPacking = await CargoPacking.findByPk(req.params.id, {
      attributes: [
        'id',
        'is_paid',
        'due_to',
        'has_insurance_fee',
        'icms_tax',
        'egg_tray_amount',
        'egg_tray_price',
        'egg_retail_box_amount',
        'egg_retail_box_price',
        'rural_fund_tax',
        'discount',
        'eligible_for_analysis',
        'receipt_value',
        'receipt_number',
        'created_by_user_id',
        'created_at',
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
          attributes: ['name', 'address'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['id', 'amount', 'cur_egg_price', 'discount'],
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
    const {
      order_items: orderItems,
      receipt_value: receiptValue,
      has_insurance_fee: hasInsuranceFee,
      icms_tax: icmsTax,
      rural_fund_tax: fundoRuralTax,
      egg_tray_amount: eggTrayAmount,
      egg_tray_price: eggTrayPrice,
      egg_retail_box_amount: eggRetailBoxAmount,
      egg_retail_box_price: eggRetailBoxPrice,
    } = cargoPacking;

    const totalBoxesAmount = orderItems.reduce(
      (acc, egg) => acc + egg.amount,
      0
    );

    const totalEggsCargoPrice = +orderItems
      .reduce(
        (acc, egg) => acc + (egg.cur_egg_price - egg.discount) * egg.amount,
        0
      )
      .toFixed(2);

    const insurancePrice = hasInsuranceFee
      ? +((totalEggsCargoPrice / 0.85) * 0.01).toFixed(2)
      : 0;

    const icmsFee = +(totalBoxesAmount * icmsTax * 0.07).toFixed(2);

    const ruralFundFee = fundoRuralTax
      ? +(receiptValue * fundoRuralTax * 0.01).toFixed(2)
      : 0;

    const eggTrayValue = parseFloat(eggTrayAmount) * parseFloat(eggTrayPrice);
    const eggRetailBoxValue = eggRetailBoxAmount * eggRetailBoxPrice;
    const decimalTotalEggsCargoPrice = parseFloat(totalEggsCargoPrice).toFixed(
      2
    );

    const balanceDue = +(
      totalEggsCargoPrice +
      icmsFee +
      insurancePrice -
      ruralFundFee +
      eggTrayValue +
      eggRetailBoxValue
    ).toFixed(2);

    return res.json({
      cargoPacking,
      cargoVirtualData: {
        totalBoxesAmount,
        totalEggsCargoPrice: decimalTotalEggsCargoPrice,
        balanceDue,
        insurancePrice,
        icmsFee,
        ruralFundFee,
        eggTrayValue,
        eggRetailBoxValue,
      },
    });
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
      where: { customer_id: req.params.id },
      attributes: [
        'id',
        'is_paid',
        'due_to',
        'has_insurance_fee',
        'icms_tax',
        'egg_tray_amount',
        'egg_tray_price',
        'egg_retail_box_amount',
        'egg_retail_box_price',
        'rural_fund_tax',
        'discount',
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
          attributes: ['name'],
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['id', 'amount', 'cur_egg_price', 'discount'],
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
        icms_tax: icmsTax,
        rural_fund_tax: fundoRuralTax,
        egg_tray_amount: eggTrayAmount,
        egg_tray_price: eggTrayPrice,
        egg_retail_box_amount: eggRetailBoxAmount,
        egg_retail_box_price: eggRetailBoxPrice,
        discount,
      } = cargoPacking;

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
      const eggTrayValue = parseFloat(eggTrayAmount) * parseFloat(eggTrayPrice);
      const eggRetailBoxValue =
        parseFloat(eggRetailBoxAmount) * parseFloat(eggRetailBoxPrice);

      const balanceDue = +(
        totalEggsCargoPrice +
        icmsFee +
        insurancePrice -
        ruralFundFee -
        discountValue +
        eggTrayValue +
        eggRetailBoxValue
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
          eggTrayValue,
          eggRetailBoxValue,
        },
      };
    });

    return res.json(result);
  }

  async filteredSimple(req, res) {
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
    const cargoPacking = await CargoPacking.findByPk(req.params.id, {
      attributes: [
        'id',
        'is_paid',
        'due_to',
        'has_insurance_fee',
        'egg_tray_amount',
        'egg_tray_price',
        'egg_retail_box_amount',
        'egg_retail_box_price',
        'receipt_value',
        'receipt_number',
        'created_by_user_id',
        'updated_by_user_id',
        'customer_id',
      ],
      include: [
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['id', 'amount', 'cur_egg_price', 'discount'],
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

    return res.json({
      cargoPacking,
    });

    // return res.json(customerCargoPacking);
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
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name'],
        },
      ],
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
      discount,
      rural_fund_tax,
      icms_tax,
      egg_tray_amount,
      egg_tray_price,
      egg_retail_box_amount,
      egg_retail_box_price,
      due_to,
      customer_id,
      receipt_value,
      receipt_number,
    } = req.body;

    const decimalEggTrayPrice = parseFloat(egg_tray_price).toFixed(2);
    const decimalEggBoxPrice = parseFloat(egg_retail_box_price).toFixed(2);
    const decimalReceitpValue = parseFloat(receipt_value).toFixed(2);

    const discountToSave = discount || 0;
    const ruralFundTaxToSave = rural_fund_tax || 0;
    const icmsToSave = icms_tax || 0;
    const eggTrayAmount = egg_tray_amount || 0;
    const eggTrayPrice = decimalEggTrayPrice || 0;
    const eggRetailBoxAmount = egg_retail_box_amount || 0;
    const eggRetailBoxPrice = decimalEggBoxPrice || 0;

    await CargoPacking.create({
      is_paid,
      has_insurance_fee,
      due_to,
      eligible_for_analysis: eligibeForAnalysis,
      customer_id,
      egg_tray_amount: eggTrayAmount,
      egg_tray_price: eggTrayPrice,
      egg_retail_box_amount: eggRetailBoxAmount,
      egg_retail_box_price: eggRetailBoxPrice,
      discount: discountToSave,
      rural_fund_tax: ruralFundTaxToSave,
      icms_tax: icmsToSave,
      created_by_user_id,
      updated_by_user_id,
      receipt_value: decimalReceitpValue,
      receipt_number,
    });

    const currentCargoPacking = await CargoPacking.findOne({
      where: { receipt_number: req.body.receipt_number },
    });

    eggs_cargo.forEach(async (egg) => {
      try {
        const currentEgg = await Egg.findOne({
          where: { color: egg.color, size: egg.size },
          // where: { id: egg.egg_id },
        });
        if (egg.amount > 0)
          await OrderItem.create({
            cargo_packing_id: currentCargoPacking.id,
            egg_id: currentEgg.id,
            amount: egg.amount,
            discount: egg.discount,
            cur_egg_price: currentEgg.price,
          });
      } catch (err) {
        console.log(err);
      }
    });

    return res.json({
      id,
      is_paid,
      discount,
      rural_fund_tax,
      icms_tax,
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
    // const { is_admin: isAdmin } = await User.findByPk(req.userId);

    // if (!isAdmin) {
    //   return res
    //     .status(401)
    //     .json({ error: `You need admin privilege to edit an egg` });
    // }

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
      console.log(JSON.stringify(egg));
      try {
        const currentEgg = await Egg.findOne({
          where: { color: egg.color, size: egg.size },
        });
        const orderItemToUpdate = await OrderItem.findOne({
          where: {
            cargo_packing_id: req.params.id,
            egg_id: currentEgg.id,
          },
        });

        console.log('orderItemToUpdate', orderItemToUpdate);

        if (orderItemToUpdate) {
          await orderItemToUpdate.update({
            amount: egg.amount,
            discount: egg.discount,
          });
        } else {
          await OrderItem.create({
            cargo_packing_id: req.params.id,
            egg_id: currentEgg.id,
            amount: egg.amount,
            discount: egg.discount,
            cur_egg_price: currentEgg.price,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

    await cargoPacking.update(updatedCargoPacking);

    return res.json({
      updatedCargoPacking,
    });
  }

  async indexDue(req, res) {
    const { page = 1 } = req.query;

    const dueCargoPackings = await CargoPacking.findAndCountAll({
      where: {
        is_paid: false,
      },
      limit: 9,
      offset: (page - 1) * 9,
      order: [['due_to', 'ASC']],
      attributes: [
        'id',
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

    return res.json(dueCargoPackings);
  }

  async indexPaid(req, res) {
    const { page = 1 } = req.query;

    const dueCargoPackings = await CargoPacking.findAndCountAll({
      where: {
        is_paid: true,
      },
      limit: 9,
      offset: (page - 1) * 9,
      order: [['due_to', 'ASC']],
      attributes: [
        'id',
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

    return res.json(dueCargoPackings);
  }

  async indexAnalysisCargoPackings(req, res) {
    const { page = 1 } = req.query;

    const analysisCargoPackings = await CargoPacking.findAndCountAll({
      where: {
        eligible_for_analysis: true,
      },
      limit: 9,
      offset: (page - 1) * 9,
      order: [['due_to', 'ASC']],
      attributes: [
        'id',
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

    return res.json(analysisCargoPackings);
  }
}

export default new CargoPackingController();
