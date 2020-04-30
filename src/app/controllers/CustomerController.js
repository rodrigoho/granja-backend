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
      has_fundo_rural: Yup.boolean().required(),
      icms_tax: Yup.number().required(),
      zip_code: Yup.string().required(),
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
      has_fundo_rural,
      icms_tax,
      zip_code,
    } = await Customer.create(req.body);

    const full_address = {
      state: 'DF',
      city: 'Brasília',
      complement: 'SIA Quadra 6C, lote 3',
    };

    return res.json({
      id,
      cnpj,
      phone,
      name,
      email,
      discount,
      has_fundo_rural,
      icms_tax,
      zip_code,
      full_address,
    });
  }
}

export default new CustomerController();
