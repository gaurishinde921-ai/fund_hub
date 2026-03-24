import axios from "axios";

function Payment() {

  const handlePayment = async () => {

    try {

      // STEP 1: Create Razorpay Order from backend
      const response = await axios.post(
        "http://localhost:5000/create-order",
        { amount: 100 }
      );

      const order = response.data.order;

      // STEP 2: Razorpay Checkout options
      const options = {
        key: "rzp_test_SJSLW45U0hVH25",
        amount: order.amount,
        currency: order.currency,
        name: "FundHub",
        description: "Startup Investment",
        order_id: order.id,

        handler: async function (paymentResponse) {

          console.log("Payment Response:", paymentResponse);

          // STEP 3: Verify payment & update escrow
          await axios.post(
            "http://localhost:5000/verify-razorpay",
            {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              campaignId: "CMP001",
              amount: 100
            }
          );

          alert("Payment Successful & Escrow Updated");

        },

        prefill: {
          name: "Investor",
          email: "investor@example.com",
          contact: "9999999999"
        },

        theme: {
          color: "#3399cc"
        }
      };

      // STEP 4: Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {

      console.log("Payment Error:", error);
      alert("Payment Failed");

    }

  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Invest in Startup</h2>

      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Invest ₹100
      </button>
    </div>
  );

}

export default Payment;
