/**
 * Backend entry point
 */

import dotenv from 'dotenv';
import { startServer } from './server.js';

// Load environment variables
dotenv.config();

// Start the server
startServer();
