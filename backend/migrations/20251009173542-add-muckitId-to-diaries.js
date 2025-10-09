'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 'up' 함수: 'diaries' 테이블에 'muckitId' 컬럼을 추가합니다.
    await queryInterface.addColumn('diaries', 'muckitId', {
      type: Sequelize.INTEGER,
      allowNull: true, // 먹킷리스트와 연동되지 않은 일기도 있으므로 NULL 허용
      references: {
        model: 'maps', // 'maps' 테이블을 참조
        key: 'id',     // 'maps' 테이블의 'id'를 참조
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // 참조하는 가게가 삭제되어도 일기는 남도록 설정
    });
  },

  async down(queryInterface, Sequelize) {
    // 'down' 함수: 'diaries' 테이블에서 'muckitId' 컬럼을 제거합니다.
    await queryInterface.removeColumn('diaries', 'muckitId');
  }
};