import Notification from '../schemas/Notification';
import Customer from '../models/Customer';

class NotificationController {
  async index(req, res) {
    const customer = await Customer.findOne({
      where: { id: req.userId },
    });

    if (!customer) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find()
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
