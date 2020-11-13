import * as Yup from 'yup';
import CargoPacking from '../models/CargoPacking';
import Notification from '../models/Notification';
import User from '../models/User';
import Customer from '../models/Customer';

class NotificationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cargo_packing_id: Yup.number().required(),
      customer_id: Yup.number().required(),
      user_id: Yup.number().required(),
      message: Yup.string().required(),
      users_to_notify: Yup.array().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const notificationExists = await Notification.findOne({
      where: { cargo_packing_id: req.body.cargo_packing_id },
    });

    if (notificationExists) {
      return res.status(400).json({ error: 'Notification already exists.' });
    }

    const {
      id,
      customer_id,
      user_id,
      cargo_packing_id,
      message,
      users_to_notify,
    } = req.body;

    await Notification.create({
      cargo_packing_id,
      user_id,
      customer_id,
      message,
      users_to_notify,
    });

    return res.json({
      id,
      customer_id,
      user_id,
      cargo_packing_id,
    });
  }

  async index(req, res) {
    const notifications = await Notification.findAll({
      attributes: ['id', 'message', 'users_to_notify'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: CargoPacking,
          as: 'cargo_packing',
          attributes: ['id', 'receipt_number'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['name'],
        },
      ],
    });

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByPk(req.params.id);
    await notification.update(req.body);

    return res.json(notification);
  }
}

export default new NotificationController();
