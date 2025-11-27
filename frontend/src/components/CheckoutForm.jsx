import React from 'react';

const CheckoutForm = () => {
  return (
    <form className="space-y-4">
      <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="MM/YY" className="w-full p-3 border rounded-lg" />
        <input type="text" placeholder="CVC" className="w-full p-3 border rounded-lg" />
      </div>
      <button type="submit" className="w-full bg-mint text-forest py-3 rounded-lg font-medium">Pay Now</button>
    </form>
  );
};

export default CheckoutForm;
