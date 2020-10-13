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
      phone,
      email,
      city,
      state,
    } = await IntermediaryCustomer.create(req.body);

    console.log(`\n${JSON.stringify(customers)}\n`);

    customers.forEach(async (customerId) => {
      try {
        const customerToUpdate = Customer.findByPk(customerId);
        if (customerToUpdate) {
          await (await customerToUpdate).update({
            intermediary_id: id,
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

    return res.json({
      id,
      phone,
      name,
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
      req.params.id,
      {
        include: [
          {
            model: Customer,
            as: 'customers',
          },
        ],
      }
    );

    return res.json(intermediaryCustomers);
  }
}
export default new IntermediaryCustomerController();
