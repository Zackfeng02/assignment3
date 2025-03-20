import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import connectDB from './config/db.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolver.js';
import { authMiddleware } from './utils/auth.js';
import logger from './utils/logger.js';

dotenv.config();

const initializeServer = async () => {
  const app = express();

  // 1️⃣ ✅ Connect to MongoDB
  await connectDB();

  // 2️⃣ ✅ Apply Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    })
  );

  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['POST'],
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // limit each IP to 200 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // 3️⃣ ✅ Use JSON Middleware
  app.use(express.json());

  // 4️⃣ ✅ Apply Authentication Middleware
  app.use(authMiddleware);

  // 5️⃣ ✅ Configure Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({ req }) => ({ user: req.user }),
    formatError: (error) => {
      logger.error(error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
    plugins: [
      {
        async requestDidStart() {
          return {
            async didResolveOperation({ request, operationName }) {
              logger.info(`Operation: ${operationName}`, {
                query: request.query,
                variables: request.variables,
              });
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  // 6️⃣ ✅ Apply GraphQL Middleware
  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  });

  // 7️⃣ ✅ Health Check Endpoint
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // 8️⃣ ✅ Start Express Server
  const server = app.listen(process.env.PORT || 4000, () => {
    logger.info(`🚀 Auth Service running on port ${process.env.PORT || 4000}`);
    logger.info(`📌 GraphQL endpoint: ${apolloServer.graphqlPath}`);
  });

  // 9️⃣ ✅ Graceful Shutdown
  const shutdown = async () => {
    logger.info('Shutting down server...');
    await server.close();
    logger.info('Server terminated');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
};

// 🔟 ✅ Handle Unexpected Errors
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// 🔥 Start the Server
initializeServer().catch((error) => {
  logger.error('❌ Failed to initialize server:', error);
  process.exit(1);
});
