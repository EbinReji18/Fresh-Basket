import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

//  STEP 1: Handle Stripe Webhook FIRST — before any middleware
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

//  STEP 2: THEN apply middlewares
app.use(express.json());
app.use(cookieParser());

// Allow Multiple Origins
const allowedOrigins = ['http://localhost:5173', 'https://freshbasketfrontend.vercel.app'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

//  STEP 3: Register API Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

//  STEP 4: Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
