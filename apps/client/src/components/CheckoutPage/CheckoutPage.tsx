"use client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import type { FormEvent } from "react";
import { savePaymentHistory } from "@/services/payment.service";

const CheckoutPage = ({ prices }: { clientSecret: string; prices: string | null }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/Dashboard`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setErrorMessage(confirmError.message ?? "Payment confirmation failed");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      const paymentInfo = {
        userName: name,
        email: email,
        transactionId: paymentIntent.id,
        amount: Number(prices ?? 0),
        date: new Date().toISOString(),
      };

      try {
        const response = await savePaymentHistory(paymentInfo);

        if (response.success) {
          Swal.fire({
            title: "Payment Successful!",
            text: `Your payment of $${prices} was successful and your account has been upgraded to Pro!`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/Dashboard";
          });
        } else {
          throw new Error(
            response.error || "Failed to update user status"
          );
        }
      } catch {
        Swal.fire({
          title: "Error",
          text: "There was an error processing your payment",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="text-center mt-3">
      <form onSubmit={handleSubmit}>
        <PaymentElement className="w-[500px] mx-auto mb-4" />
        {errorMessage && <div>{errorMessage}</div>}
        <Button
          disabled={!stripe || loading}
          className="bg-primary-color hover:bg-secondary-color w-[500px]"
        >
          {!loading ? `Pay $${prices}` : "Processing..."}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;
