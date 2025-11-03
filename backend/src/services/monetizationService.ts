import Stripe from 'stripe';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export class MonetizationService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16'
    });
  }

  /**
   * Create a subscription for a user
   */
  async createSubscription(customerId: string, priceId: string): Promise<any> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
      return subscription;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new AppError('Failed to create subscription', 500);
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(email: string, metadata?: any): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        metadata
      });
      return customer;
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw new AppError('Failed to create customer', 500);
    }
  }

  /**
   * Create a payment intent for one-time purchases
   */
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true }
      });
      return paymentIntent;
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      throw new AppError('Failed to create payment intent', 500);
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      logger.error('Error canceling subscription:', error);
      throw new AppError('Failed to cancel subscription', 500);
    }
  }

  /**
   * Retrieve subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      logger.error('Error retrieving subscription:', error);
      throw new AppError('Failed to retrieve subscription', 500);
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      return event;
    } catch (error) {
      logger.error('Error verifying webhook signature:', error);
      throw new AppError('Invalid webhook signature', 400);
    }
  }

  /**
   * Create usage record for metered billing
   */
  async recordUsage(subscriptionItemId: string, quantity: number): Promise<Stripe.UsageRecord> {
    try {
      const usageRecord = await this.stripe.subscriptionItems.createUsageRecord(
        subscriptionItemId,
        {
          quantity,
          timestamp: Math.floor(Date.now() / 1000)
        }
      );
      return usageRecord;
    } catch (error) {
      logger.error('Error recording usage:', error);
      throw new AppError('Failed to record usage', 500);
    }
  }
}
