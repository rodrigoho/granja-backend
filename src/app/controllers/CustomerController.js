import * as Yup from 'yup';
import Customer from '../models/Customer';

class CustomerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cnpj: Yup.string().required(),
      phone: Yup.string().required(),
      email: Yup.string().email().required(),
      discount: Yup.number().required(),
      rural_fund_tax: Yup.number().required(),
      icms_tax: Yup.number().required(),
      zip_code: Yup.string().required(),
      address: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const userExists = await Customer.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const {
      id,
      name,
      cnpj,
      phone,
      email,
      discount,
      rural_fund_tax,
      icms_tax,
      zip_code,
      address,
    } = await Customer.create(req.body);

    return res.json({
      id,
      cnpj,
      phone,
      name,
      email,
      discount,
      rural_fund_tax,
      icms_tax,
      zip_code,
      address,
    });
  }

  async index(req, res) {
    const customers = await Customer.findAll();

    return res.json(customers);
  }
}

export default new CustomerController();
