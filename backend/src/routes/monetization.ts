import { Router, Request, Response, NextFunction } from 'express';
import { MonetizationService } from '../services/monetizationService.js';

const router = Router();
const monetizationService = new MonetizationService();

/**
 * POST /api/monetization/customers
 * Create a new customer
 */
router.post('/customers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, metadata } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const customer = await monetizationService.createCustomer(email, metadata);
    res.json({ customer });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/monetization/subscriptions
 * Create a new subscription
 */
router.post('/subscriptions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, priceId } = req.body;

    if (!customerId || !priceId) {
      return res.status(400).json({ error: 'customerId and priceId are required' });
    }

    const subscription = await monetizationService.createSubscription(customerId, priceId);
    res.json({ subscription });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/monetization/subscriptions/:subscriptionId
 * Cancel a subscription
 */
router.delete('/subscriptions/:subscriptionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await monetizationService.cancelSubscription(subscriptionId);
    res.json({ subscription });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/monetization/subscriptions/:subscriptionId
 * Get subscription details
 */
router.get('/subscriptions/:subscriptionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await monetizationService.getSubscription(subscriptionId);
    res.json({ subscription });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/monetization/payment-intents
 * Create a payment intent
 */
router.post('/payment-intents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'amount is required' });
    }

    const paymentIntent = await monetizationService.createPaymentIntent(amount, currency);
    res.json({ paymentIntent });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/monetization/webhooks
 * Handle Stripe webhooks
 */
router.post('/webhooks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    const event = await monetizationService.handleWebhook(
      req.body,
      signature
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'customer.subscription.created':
        // Handle new subscription
        break;
      case 'customer.subscription.deleted':
        // Handle cancelled subscription
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/monetization/usage
 * Record usage for metered billing
 */
router.post('/usage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subscriptionItemId, quantity } = req.body;

    if (!subscriptionItemId || quantity === undefined) {
      return res.status(400).json({ 
        error: 'subscriptionItemId and quantity are required' 
      });
    }

    const usageRecord = await monetizationService.recordUsage(subscriptionItemId, quantity);
    res.json({ usageRecord });
  } catch (error) {
    next(error);
  }
});

export default router;
