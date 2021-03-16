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
    const {
      page = 1,
      sort_direction: sortDirection = 'ASC',
      column_to_sort: columnToSort = 'due_to',
    } = req.query;

    const cargoPackings = await CargoPacking.findAndCountAll({
      limit: 10,
      offset: (page - 1) * 10,
      order: [[columnToSort, sortDirection]],
      attributes: [
        'id',
        'is_paid',
        'due_to',
        'has_insurance_fee',
        'receipt_number',
        'customer_id',
        'created_at',
        'custom_date',
        'total_price',
        'paid_amount',
        'custom_date_timestamp',
      ],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name'],
          paranoid: false,
        },
        {
          model: IntermediaryCustomer,
          as: 'intermediary',
          attributes: ['name', 'email', 'phone'],
          paranoid: false,
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
        'custom_date',
        'total_price',
        'paid_amount',
        'is_billet',
        'payments',
        'additional_fee',
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
          paranoid: false,
        },
        {
          model: IntermediaryCustomer,
          as: 'intermediary',
          attributes: ['name', 'phone', 'id'],
          paranoid: false,
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes: ['id', 'amount', 'cur_egg_price', 'discount'],
          include: [
            {
              model: Egg,
              as: 'egg_details',
              attributes: ['color', 'size', 'id'],
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
      paid_amount: paidAmount,
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
        paidAmount,
      },
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      is_paid: Yup.boolean().required(),
      due_to: Yup.date().required(),
      eggs_cargo: Yup.array(),
      has_insurance_fee: Yup.boolean(),
      customer_id: Yup.number().required(),
      // created_by_user_id: Yup.number().required(),
      // receipt_number: Yup.number().required(),
      // receipt_value: Yup.number().required(),
    });

    const eligibeForAnalysis = false;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // const cargoPackingExists = await CargoPacking.findOne({
    //   where: { receipt_number: req.body.receipt_number },
    // });

    // if (cargoPackingExists) {
    //   return res.status(400).json({ error: 'Cargo packing already exists.' });
    // }
    // const dueCargoPacking = await CargoPacking.findOne({
    //   where: { customer_id: req.body.customer_id, is_paid: false },
    //   include: [
    //     {
    //       model: Customer,
    //       as: 'customer',
    //       attributes: ['name'],
    //     },
    //   ],
    // });

    // if (dueCargoPacking) {
    //   eligibeForAnalysis = true;
    // }

    const {
      is_paid,
      eggs_cargo,
      created_by_user_id,
      updated_by_user_id,
      has_insurance_fee,
      discount,
      custom_date,
      custom_date_timestamp,
      rural_fund_tax,
      icms_tax,
      egg_tray_amount,
      egg_tray_price,
      egg_retail_box_amount,
      egg_retail_box_price,
      due_to,
      customer_id,
      intermediary_id,
      receipt_value,
      receipt_number,
      is_billet,
      additional_fee,
      payments,
    } = req.body;

    const paidAmount = payments.reduce(
      (acc = 0, payment) => acc + parseFloat(payment.paid_amount),
      0
    );

    const decimalEggTrayPrice = parseFloat(egg_tray_price).toFixed(2);
    const decimalEggBoxPrice = parseFloat(egg_retail_box_price).toFixed(2);
    const decimalReceitpValue = receipt_value
      ? parseFloat(receipt_value).toFixed(2)
      : 0;

    const discountToSave = discount || 0;
    const ruralFundTaxToSave = rural_fund_tax || 0;
    const icmsToSave = icms_tax || 0;
    const eggTrayAmount = egg_tray_amount || 0;
    const eggTrayPrice = decimalEggTrayPrice || 0;
    const eggRetailBoxAmount = egg_retail_box_amount || 0;
    const eggRetailBoxPrice = decimalEggBoxPrice || 0;
    // const totalPrice = total_price || 0;

    const totalBoxesAmount = eggs_cargo.reduce(
      (acc, egg) => acc + parseFloat(egg.amount),
      0
    );

    const totalEggsCargoPrice = +eggs_cargo
      .reduce((acc, egg) => acc + (egg.eggPrice - egg.discount) * egg.amount, 0)
      .toFixed(2);

    const insurancePrice = has_insurance_fee
      ? +((totalEggsCargoPrice / 0.85) * 0.01).toFixed(2)
      : 0;

    const icmsFee = +(totalBoxesAmount * icmsToSave * 0.07).toFixed(2);

    const ruralFundFee = rural_fund_tax
      ? +(decimalReceitpValue * rural_fund_tax * 0.01).toFixed(2)
      : 0;

    const eggTrayValue = parseFloat(eggTrayAmount) * parseFloat(eggTrayPrice);
    const eggRetailBoxValue = eggRetailBoxAmount * eggRetailBoxPrice;

    const balanceDue = +(
      totalEggsCargoPrice +
      icmsFee +
      insurancePrice -
      ruralFundFee +
      eggTrayValue +
      eggRetailBoxValue
    ).toFixed(2);

    const currentCargoPacking = await CargoPacking.create({
      is_paid,
      has_insurance_fee,
      due_to,
      custom_date,
      custom_date_timestamp,
      eligible_for_analysis: eligibeForAnalysis,
      customer_id,
      intermediary_id,
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
      total_price: balanceDue,
      paid_amount: paidAmount,
      is_billet,
      additional_fee,
      payments,
    });

    const { id } = currentCargoPacking;

    eggs_cargo.forEach(async (egg) => {
      try {
        if (egg.amount > 0)
          await OrderItem.create({
            cargo_packing_id: currentCargoPacking.id,
            egg_id: egg.eggId,
            amount: egg.amount,
            discount: egg.discount,
            cur_egg_price: egg.eggPrice,
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
      custom_date,
      is_billet,
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
      rural_fund_tax,
      is_billet,
      due_to,
      icms_tax,
      egg_retail_box_amount,
      egg_retail_box_price,
      egg_tray_amount,
      egg_tray_price,
      receipt_value,
      receipt_number,
      created_by_user_id,
      additional_fee,
      payments,
    } = req.body;

    const paidAmount = payments.reduce(
      (acc = 0, payment) => acc + parseFloat(payment.paid_amount),
      0
    );

    const cargoPacking = await CargoPacking.findByPk(req.params.id);

    const decimalEggTrayPrice = parseFloat(egg_tray_price).toFixed(2);
    const decimalEggBoxPrice = parseFloat(egg_retail_box_price).toFixed(2);
    const decimalReceitpValue = receipt_value
      ? parseFloat(receipt_value).toFixed(2)
      : 0;

    const icmsToSave = icms_tax || 0;
    const eggTrayAmount = egg_tray_amount || 0;
    const eggTrayPrice = decimalEggTrayPrice || 0;
    const eggRetailBoxAmount = egg_retail_box_amount || 0;
    const eggRetailBoxPrice = decimalEggBoxPrice || 0;

    const totalBoxesAmount = eggs_cargo.reduce(
      (acc, egg) => acc + parseFloat(egg.amount),
      0
    );

    const totalEggsCargoPrice = +eggs_cargo
      .reduce((acc, egg) => acc + (egg.eggPrice - egg.discount) * egg.amount, 0)
      .toFixed(2);

    const insurancePrice = has_insurance_fee
      ? +((totalEggsCargoPrice / 0.85) * 0.01).toFixed(2)
      : 0;

    const icmsFee = +(totalBoxesAmount * icmsToSave * 0.07).toFixed(2);

    const ruralFundFee = rural_fund_tax
      ? +(decimalReceitpValue * rural_fund_tax * 0.01).toFixed(2)
      : 0;

    const eggTrayValue = parseFloat(eggTrayAmount) * parseFloat(eggTrayPrice);
    const eggRetailBoxValue = eggRetailBoxAmount * eggRetailBoxPrice;

    const balanceDue = +(
      totalEggsCargoPrice +
      icmsFee +
      insurancePrice -
      ruralFundFee +
      eggTrayValue +
      eggRetailBoxValue
    ).toFixed(2);

    const updatedCargoPacking = {
      id,
      eggs_cargo,
      is_paid,
      has_insurance_fee,
      is_billet,
      icms_tax,
      due_to,
      rural_fund_tax,
      egg_retail_box_amount,
      egg_retail_box_price,
      egg_tray_amount,
      egg_tray_price,
      receipt_value,
      receipt_number,
      created_by_user_id,
      updated_by_user_id: req.userId,
      paid_amount: paidAmount,
      total_price: balanceDue,
      additional_fee,
      payments,
    };

    eggs_cargo.forEach(async (egg) => {
      try {
        const currentEgg = await Egg.findOne({
          where: { id: egg.eggId },
        });
        const orderItemToUpdate = await OrderItem.findOne({
          where: {
            cargo_packing_id: req.params.id,
            egg_id: currentEgg.id,
          },
        });

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

  // esse que ta usando
  async indexDue(req, res) {
    const {
      page = 1,
      sort_direction: sortDirection = 'ASC',
      column_to_sort: columnToSort = 'due_to',
    } = req.query;

    const dueCargoPackings = await CargoPacking.findAndCountAll({
      where: {
        is_paid: false,
      },
      limit: 10,
      offset: (page - 1) * 10,
      order: [[columnToSort, sortDirection]],
      attributes: [
        'id',
        'is_paid',
        'due_to',
        'has_insurance_fee',
        'receipt_number',
        'customer_id',
        'created_at',
        'custom_date',
        'total_price',
        'paid_amount',
        'custom_date_timestamp',
      ],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name'],
          paranoid: false,
        },
        {
          model: IntermediaryCustomer,
          as: 'intermediary',
          attributes: ['name', 'email', 'phone'],
          paranoid: false,
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
      offset: (page - 1) * 8,
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
      offset: (page - 1) * 8,
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

  async delete(req, res) {
    const cargoPacking = await CargoPacking.findByPk(req.params.id);

    // const { is_admin: isAdmin } = await User.findByPk(req.userId);

    // if (!isAdmin) {
    //   return res
    //     .status(401)
    //     .json({ error: `You need admin privilege to edit a CargoPacking` });
    // }

    await CargoPacking.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json(cargoPacking);
  }
}

export default new CargoPackingController();
