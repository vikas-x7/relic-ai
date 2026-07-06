import { Hono } from 'hono';
import { authRoutes } from './modules/auth/routes';

export const app = new Hono();

app.get('/', (c) => c.text('Relic AI API'));

app.route('/auth', authRoutes);