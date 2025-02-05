'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('diaries', 'title', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '제목 없음',  // 기본값 설정
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('diaries', 'title');
  }
};
