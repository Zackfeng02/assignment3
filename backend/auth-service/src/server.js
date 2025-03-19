import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
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
  
  // 1. Database Connection
  await connectDB();

  // 2. Security Middleware
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
  }));
  
  app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST'],
    credentials: true
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  }));

  // 3. Authentication Middleware
  app.use(authMiddleware);

  // 4. Apollo Server Configuration
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [
      depthLimit(5),
      createComplexityLimitRule(1000)
    ],
    context: ({ req }) => ({ user: req.user }),
    formatError: (error) => {
      logger.error(error);
      return {
        message: error.message,
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
      };
    },
    plugins: [{
      async requestDidStart() {
        return {
          async didResolveOperation({ request, operationName }) {
            logger.info(`Operation: ${operationName}`, {
              query: request.query,
              variables: request.variables
            });
          }
        };
      }
    }]
  });

  await apolloServer.start();
  
  // 5. Apply Middleware
  apolloServer.applyMiddleware({ 
    app,
    path: '/graphql',
    cors: false
  });

  // 6. Health Check Endpoint
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // 7. Server Initialization
  const server = app.listen(process.env.PORT, () => {
    logger.info(`Auth service running on port ${process.env.PORT}`);
    logger.info(`GraphQL endpoint: ${apolloServer.graphqlPath}`);
  });

  // 8. Graceful Shutdown
  const shutdown = async () => {
    logger.info('Shutting down server...');
    await server.close();
    await mongoose.disconnect();
    logger.info('Server terminated');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
};

// 9. Error Handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// 10. Start Server
initializeServer().catch((error) => {
  logger.error('Failed to initialize server:', error);
  process.exit(1);
});