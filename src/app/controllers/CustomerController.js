import * as Yup from 'yup';
import Customer from '../models/Customer';

class CustomerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      // phone: Yup.string().required(),
      discount: Yup.number().required(),
      rural_fund_tax: Yup.number().required(),
      icms_tax: Yup.number().required(),
      zip_code: Yup.string().required(),
      address: Yup.object().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // const userExists = await Customer.findOne({
    //   where: { phone: req.body.phone },
    // });

    // if (userExists) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Já existe um cliente com esse Telefone.' });
    // }

    const {
      id,
      name,
      fantasy_name,
      cnpj,
      phone,
      email,
      discount,
      rural_fund_tax,
      icms_tax,
      zip_code,
      address,
    } = await Customer.create(req.body);

    console.log('não é aqui');

    return res.json({
      id,
      cnpj,
      phone,
      name,
      fantasy_name,
      email,
      discount,
      rural_fund_tax,
      icms_tax,
      zip_code,
      address,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const customers = await Customer.findAndCountAll({
      order: [['name', 'ASC']],
      limit: 10,
      offset: (page - 1) * 10,
      // limit: 15,
      // offset: (page - 1) * 15,
    });

    return res.json(customers);
  }

  async indexNonRelated(req, res) {
    const customers = await Customer.findAndCountAll({
      where: { intermediary_id: null },
    });

    return res.json(customers);
  }

  async filteredById(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    return res.json(customer);
  }

  async delete(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    // const { is_admin: isAdmin } = await User.findByPk(req.userId);

    // if (!isAdmin) {
    //   return res
    //     .status(401)
    //     .json({ error: `You need admin privilege to edit an egg` });
    // }

    await Customer.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json(customer);
  }

  async update(req, res) {
    // const schema = Yup.object().shape({
    //   id: Yup.number(),
    //   price: Yup.string(),
    // });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }

    // const { name, email } = req.body;
    const customer = await Customer.findByPk(req.params.id);

    await customer.update(req.body);

    return res.json({ status: 'success' });
  }
}

export default new CustomerController();
