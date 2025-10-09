'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('maps', 'status', {
      type: Sequelize.ENUM('WISHED', 'VISITED'),
      allowNull: false,
      defaultValue: 'WISHED',
    });
  },

  async down(queryInterface, Sequelize) {
    // down에서는 enum 타입을 삭제하기 위해 조금 다른 방식이 필요함
    await queryInterface.removeColumn('maps', 'status');
    await queryInterface.sequelize.query('DROP TYPE "enum_maps_status";');
  }
};