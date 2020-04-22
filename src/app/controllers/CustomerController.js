import * as Yup from 'yup';
import Customer from '../models/Customer';

class CustomerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      discount: Yup.number().required(),
      cnpj: Yup.string().required(),
      address: Yup.string().required(),
      phone: Yup.string().required(),
      icms_tax: Yup.number().required(),
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
      email,
      discount,
      cnpj,
      address,
      phone,
      icms_tax,
    } = await Customer.create(req.body);

    return res.json({
      id,
      cnpj,
      address,
      phone,
      name,
      email,
      discount,
      icms_tax,
    });
  }
}

export default new CustomerController();
