import * as Yup from 'yup';
import AdditionalFee from '../models/AdditionalFee';

class AdditionalFeeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      current_fee_price: Yup.number().required(),
      max_fee: Yup.number().required(),
      min_fee: Yup.number().required(),
      online_fee: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const additionalFeeExists = await AdditionalFee.findAll();

    if (additionalFeeExists.length) {
      return res.status(400).json({ error: `Já existe uma taxa cadastrada` });
    }

    const { id, current_fee_price, online_fee } = await AdditionalFee.create({
      ...req.body,
      last_edited_by_user_id: req.userId,
    });

    return res.json({
      id,
      current_fee_price,
      online_fee,
    });
  }

  async index(req, res) {
    const additionalFee = await AdditionalFee.findAll();
    return res.json(additionalFee);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      current_fee_price: Yup.number(),
      online_fee: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { current_fee_price, online_fee, min_fee, max_fee } = req.body;
    const additionalFee = await AdditionalFee.findByPk(req.params.id);

    const updatedAdditionalFee = {
      ...additionalFee,
      min_fee,
      max_fee,
      current_fee_price,
      online_fee,
      last_edited_by_user_id: req.userId,
    };

    const { id } = await additionalFee.update(updatedAdditionalFee);

    return res.json({
      id,
      current_fee_price,
      online_fee,
      last_edited_by_user_id: req.userId,
    });
  }
}

export default new AdditionalFeeController();
