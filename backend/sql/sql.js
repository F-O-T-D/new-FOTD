module.exports = {
  userList: `SELECT * FROM users`,
  userInsert: `INSERT INTO users SET ?`,
  userUpdate: `UPDATE users SET ? WHERE userId=?`,
  userDelete: `DELETE FROM users WHERE userId=?`,
  userLogin: `SELECT * FROM users WHERE email=?`,
};
