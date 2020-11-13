import * as Yup from 'yup';
import Customer from '../models/Customer';
import IntermediaryCustomer from '../models/IntermediaryCustomer';

class IntermediaryCustomerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      phone: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const intermediaryCustomerExists = await IntermediaryCustomer.findOne({
      where: { phone: req.body.phone },
    });

    if (intermediaryCustomerExists) {
      return res
        .status(400)
        .json({ error: 'Já existe um intermediário com esse Telefone.' });
    }
    const { customers } = req.body;
    const {
      id,
      name,
      fantasy_name,
      phone,
      email,
      city,
      state,
    } = await IntermediaryCustomer.create(req.body);

    // eslint-disable-next-line consistent-return
    customers.forEach(async (customerId) => {
      try {
        const customerToUpdate = Customer.findByPk(customerId);
        if (customerToUpdate) {
          await (await customerToUpdate).update({
            intermediary_id: id,
          });
        }
      } catch (err) {
        return res
          .status(400)
          .json({ error: 'Já existe um cliente com este telefone.' });
      }
    });

    return res.json({
      id,
      phone,
      name,
      fantasy_name,
      email,
      city,
      state,
    });
  }

  async index(req, res) {
    // const { page = 1 } = req.query;

    const intermediaryCustomers = await IntermediaryCustomer.findAll({
      order: [['name', 'ASC']],
      // limit: 15,
      // offset: (page - 1) * 15,
    });

    return res.json(intermediaryCustomers);
  }

  async indexById(req, res) {
    const intermediaryCustomers = await IntermediaryCustomer.findByPk(
      req.params.id
    );

    return res.json(intermediaryCustomers);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      phone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { id, email, name, phone, city, state } = req.body;

    const intermediary = await IntermediaryCustomer.findByPk(req.params.id);

    const usedPhone = await IntermediaryCustomer.findOne({
      where: { phone: req.body.phone },
    });

    if (usedPhone) {
      if (usedPhone.id !== id) {
        return res
          .status(400)
          .json({ error: 'Já existe um cliente com este telefone.' });
      }
    }

    await intermediary.update({
      email,
      name,
      phone,
      city,
      state,
    });
    return res.json({
      email,
      name,
      phone,
      city,
      state,
    });

    // const { name, avatar } = await User.findByPk(req.userId, {
    //   include: [
    //     {
    //       model: File,
    //       as: 'avatar',
    //       attributes: ['id', 'path', 'url'],
    //     },
    //   ],
    // });

    // return res.status(403).send({ error: 'Erro ao trocar a senha' });
  }
}
export default new IntermediaryCustomerController();
