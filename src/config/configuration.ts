export default () => ({
  secret: process.env.JWT_SECRET || 'y0sk3r1v01c313**',
  port: process.env.PORT || 3002,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'bni',
    credentials: `${process.env.DB_USER}:${process.env.DB_PASSWORD}`,
  },
});
