"use client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const CheckoutPage = ({ prices }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;

  const handleSubmit = async (event) => {
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
    });

    if (confirmError) {
      setErrorMessage(confirmError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      const paymentInfo = {
        userName: name,
        email: email,
        transactionId: paymentIntent.id,
        amount: prices,
        date: new Date(),
      };

      try {
        const response = await axios.post(
          "https://quizlytics.jonomukti.org/paymentHistory",
          paymentInfo,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
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
            response.data.error || "Failed to update user status"
          );
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.error ||
            "There was an error processing your payment",
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
