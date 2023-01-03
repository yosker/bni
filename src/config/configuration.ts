export default () => ({
  secret: process.env.JWT_SECRET || 'y0sk3r1v01c313*',
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
