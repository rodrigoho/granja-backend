import { format } from 'date-fns';
import app from './app';
import EggPrices from './app/models/EggPrices';

const http = require('http').Server(app);
const io = require('socket.io')(http);
const cron = require('node-cron');

process.env.TZ = 'America/Sao_Paulo';

const checkAndUpdate = async () => {
  const eggPricesList = await EggPrices.findAll({
    limit: 12,
    order: [['createdAt', 'DESC']],
  });

  const newDate = format(new Date(), 'dd/MM/yyyy');

  if (eggPricesList[0].price_date !== newDate) {
    eggPricesList.map(async (e) => {
      await EggPrices.create({
        egg_id: e.egg_id,
        price_date: newDate,
        cur_egg_price: e.cur_egg_price,
      });
    });
  }
};

checkAndUpdate();

cron.schedule('20 20 * * *', async () => {
  checkAndUpdate();
});
io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    io.emit('msg', msg);
  });
});

http.listen(3333, () => {
  console.log('Listening on port 3333...');
});
