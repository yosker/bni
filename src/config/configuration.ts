export default () => ({
  secret: process.env.JWT_SECRET || 'y0sk3r1v01c313*',
  port: process.env.PORT || 4000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'bni',
  },
});
