//서버 실행

const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

console.log(`Server running on http://localhost:3000`);
