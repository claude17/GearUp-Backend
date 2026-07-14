import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handleWebhookCompleted = async (session: Stripe.Checkout.Session) => {

    const rentalOrderId = session.metadata?.rentalOrderId;

    if (!rentalOrderId) {
        console.log("Webhook: Missing rentalOrderId");
        return;
    }

    if (session.payment_status !== "paid") {
        console.log("Payment not completed.");
        return;
    }

    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

    if (!paymentIntentId) {
        console.log("Webhook: Missing Payment Intent ID.");
        return;
    }

    await prisma.$transaction(async (tx) => {

        const rental = await tx.rentalOrder.findUniqueOrThrow({
            where: {
                id: rentalOrderId
            },
            include: {
                payment: true
            }
        });

        // Prevent duplicate webhook processing
        if (rental.payment) {
            return;
        }

        await tx.payment.create({
            data: {
                rentalOrderId: rental.id,
                transactionId: session.payment_intent as string,
                amount: rental.totalAmount,
                provider: "STRIPE",
                method: "CARD",
                status: "COMPLETED",
                paidAt: new Date(session.created * 1000)
            }
        });

        await tx.rentalOrder.update({
            where: {
                id: rental.id
            },
            data: {
                status: "PAID"
            }
        });

    });

};