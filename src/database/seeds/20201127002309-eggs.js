module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('eggs', [
      {
        id: 1,
        color: 'Branco',
        size: 'Jumbo',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        color: 'Branco',
        size: 'Extra',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        color: 'Branco',
        size: 'Grande',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        color: 'Branco',
        size: 'Médio',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        color: 'Branco',
        size: 'Pequeno',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        color: 'Branco',
        size: 'Industrial',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        color: 'Vermelho',
        size: 'Jumbo',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        color: 'Vermelho',
        size: 'Extra',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        color: 'Vermelho',
        size: 'Grande',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        color: 'Vermelho',
        size: 'Médio',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        color: 'Vermelho',
        size: 'Pequeno',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        color: 'Vermelho',
        size: 'Industrial',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('eggs', null, {});
  },
};
