// import { format, add } from 'date-fns';
import app from './app';
import EggPrices from './app/models/EggPrices';

const http = require('http').Server(app);
const io = require('socket.io')(http);
const cron = require('node-cron');
// const axios = require('axios');
const uepa = (oi) => {
  console.log(oi);
};

uepa('uhul deu certo');

// 0 */12 * * *
cron.schedule('* 12 * * *', async () => {
  uepa('dentro do cron');
  const teste = await EggPrices.findAll({
    limit: 12,
    order: [['createdAt', 'DESC']],
  });

  console.log(JSON.stringify(teste));

  // eslint-disable-next-line array-callback-return
  teste.map((e) => {
    const updatedEgg = {
      ...e,
      id: e.egg_id,
      size: e.size,
      price: parseFloat(e.cur_egg_price),
    };
    console.log(updatedEgg.id, JSON.stringify(updatedEgg));
    // this.updateEgg(updatedEgg);
  });
  // const newDate = format(new Date(), 'dd/MM/yyyy');
  // const result = format(
  //   add(new Date(), {
  //     days: 1,
  //   }),
  //   'dd/MM/yyyy'
  // );
  // console.log('date -1 day', result);
  // axios
  //   .post('http://localhost:3333/eggs-prices-selected', {
  //     selected_date: newDate,
  //   })
  //   .then((res) => {
  //     if (res.data.length > 0) return;
  //     axios
  //       .post('http://localhost:3333/eggs-prices-selected', {
  //         selected_date: '01/02/2021',
  //       })
  //       .then((newRes) => {
  //         console.log('to na segunda requisição');
  //         console.log(`\n01/02/2021`);
  //         console.log(newRes.data);
  //       });
  //   });
});

io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    io.emit('msg', msg);
  });
});

http.listen(3333, () => {
  console.log('Listening on port 3333...');
});
