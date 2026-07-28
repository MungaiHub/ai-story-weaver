require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { validateLlmConfig } = require('./config/validateLlm');

const PORT = process.env.PORT || 3001;

(async () => {
  await connectDB();
  await validateLlmConfig();
  app.listen(PORT, () => {
    console.log(`[server] AI Story Weaver running on port ${PORT} (${process.env.NODE_ENV})`);
  });
})().catch((err) => {
  console.error('[startup]', err.message);
  process.exit(1);
});
