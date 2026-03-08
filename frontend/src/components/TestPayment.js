import React from 'react';

const TestPayment = () => {
  const handleTestPayment = () => {
    if (!window.Razorpay) {
      alert('Razorpay not loaded');
      return;
    }

    const options = {
      key: 'rzp_test_1234567890',
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      name: 'StepStore Test',
      description: 'Test Payment',
      handler: (response) => {
        alert('Payment Success: ' + response.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => {
          alert('Payment cancelled');
        }
      },
      theme: {
        color: '#2563eb'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      alert('Payment failed: ' + response.error.description);
    });
    rzp.open();
  };

  return (
    <div className="p-4">
      <button 
        onClick={handleTestPayment}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Test Payment (₹500)
      </button>
    </div>
  );
};

export default TestPayment;