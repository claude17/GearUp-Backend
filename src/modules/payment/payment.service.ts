import { RentalStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { ICreatePaymentPayload } from "./payment.interface";
import { handleWebhookCompleted } from "./payment.utils";

const createCheckoutSessionIntoDB = async (customerId: string, payload: ICreatePaymentPayload
) => {

    const rental = await prisma.rentalOrder.findUniqueOrThrow({
        where: {
            id: payload.rentalOrderId
        },
        include: {
            payment: true,
            gearItem: true,
            customer: true
        }
    });

    if (rental.customerId !== customerId) {
        throw new Error("You are not authorized to pay for this rental.");
    }

    if (rental.status === RentalStatus.CANCELLED) {
        throw new Error("This rental has been cancelled.");
    }

    if (rental.payment) {
        throw new Error("This rental has already been paid.");
    }

    if (rental.status !== RentalStatus.CONFIRMED) {
        throw new Error("Only confirmed rentals can be paid.");
    }

    const totalDays = Math.ceil((rental.endDate.getTime() - rental.startDate.getTime()) / (1000 * 60 * 60 * 24));

    const session = await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        customer_email: rental.customer.email,

        line_items: [
            {
                quantity: 1,

                price_data: {
                    currency: "usd",

                    unit_amount: Math.round(rental.totalAmount * 100),

                    product_data: {
                        name: rental.gearItem.name,
                        description: `${totalDays} day rental @ $${rental.gearItem.dailyRentalPrice}/day. Qty: ${rental.quantity}`
                    }
                }

            }
        ],

        metadata: {
            rentalOrderId: rental.id,
            customerId: rental.customerId
        },

        success_url: `${config.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${config.app_url}/payment-cancel`
    });

    return {
        sessionId: session.id,
        checkoutUrl: session.url
    };
};


const getMyPaymentsFromDB = async (customerId: string) => {

    const payments = await prisma.payment.findMany({
        where: {
            rentalOrder: {
                customerId
            }
        },
        include: {
            rentalOrder: {
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    quantity: true,
                    totalAmount: true,
                    status: true,
                    gearItem: {
                        select: {
                            id: true,
                            name: true,
                            brand: true,
                            image: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return payments;
};

const getSinglePaymentFromDB = async (paymentId: string, customerId: string) => {

    const payment = await prisma.payment.findUniqueOrThrow({
        where: {
            id: paymentId,
            rentalOrder: {
                customerId
            }
        },
        include: {
            rentalOrder: {
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    quantity: true,
                    totalAmount: true,
                    status: true,
                    gearItem: {
                        select: {
                            id: true,
                            name: true,
                            brand: true,
                            image: true,
                            dailyRentalPrice: true
                        }
                    }
                }
            }
        }
    });

    return payment;
};

const handleStripeWebhook = async (payload: Buffer, signature: string) => {

    const endpointSecret =
        config.stripe_webhook_secret;

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    switch (event.type) {

        case "checkout.session.completed":

            await handleWebhookCompleted(
                event.data.object
            );

            break;

        default:

            console.log(
                `Unhandled event ${event.type}`
            );

            break;
    }

};

export const paymentService = {
    createCheckoutSessionIntoDB,
    getMyPaymentsFromDB,
    getSinglePaymentFromDB,
    handleStripeWebhook
};