// src/pages/Checkout.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tag } from 'lucide-react';
import type { Experience } from '../types/Bookings';

interface CheckoutState {
  experience: Experience;
  date: string;
  time: string;
  quantity: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as CheckoutState;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const subtotal = (bookingData.experience?.pricePerPerson || bookingData.experience?.pricePerPerson || 0) * bookingData.quantity;
  const taxRate = 0.1; // 10% tax
  const taxes = subtotal * taxRate;
  const discountAmount = promoApplied ? subtotal * discount : 0;
  const total = subtotal + taxes - discountAmount;

  const applyPromoCode = () => {
    // TODO: Replace with actual API call to validate promo code
    const validPromoCodes: { [key: string]: number } = {
      'SAVE10': 0.1,
      'SAVE20': 0.2,
      'WELCOME': 0.15
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setDiscount(validPromoCodes[promoCode.toUpperCase()]);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Build payload expected by server: activityId, contactDetails, selectedDate, selectedTime, numberOfParticipants, couponCode
       const activityId = bookingData.experience._id;
       const payload = {
        activityId,
        contactDetails: {
          name,
          email,
          phone: ''
        },
        selectedDate: bookingData.date,
        selectedTime: bookingData.time,
        numberOfParticipants: bookingData.quantity,
        couponCode: promoApplied ? promoCode : null
      };

      const token = localStorage.getItem('authToken');

      // POST to reservation route (preferred)
      const response = await fetch('https://bookit-node.onrender.com/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Booking API error:', data);
        navigate('/result', { state: { status: 'failure' } });
        return;
      }

      // Server returns populated reservation as data
      const reservation = data.data;

      navigate('/result', {
        state: {
          status: 'success',
          bookingId: reservation.confirmationCode || reservation._id,
          experience: reservation.activity?.title || bookingData.experience.title,
          date: reservation.selectedDate || bookingData.date,
          time: reservation.selectedTime || bookingData.time,
          quantity: reservation.numberOfParticipants || bookingData.quantity,
          total: reservation.costBreakdown?.grandTotal?.toFixed(2) || total.toFixed(2)
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      navigate('/result', {
        state: {
          status: 'failure'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Information</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6" />
                Promo Code
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={promoApplied}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter promo code"
                />
                <button
                  onClick={applyPromoCode}
                  disabled={promoApplied || !promoCode.trim()}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    promoApplied
                      ? 'bg-green-600 text-white'
                      : promoCode.trim()
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {promoApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>

              {promoApplied && (
                <p className="text-green-600 text-sm mt-2">
                  Promo code applied! You saved ${discountAmount.toFixed(2)}
                </p>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <p className="font-medium mb-1">Try these codes:</p>
                <p>SAVE10 - 10% off | SAVE20 - 20% off | WELCOME - 15% off</p>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-lg font-semibold text-gray-900">{bookingData.experience.title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-gray-900">{formatDate(bookingData.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-gray-900">{bookingData.time}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p className="text-gray-900">{bookingData.quantity} guest{bookingData.quantity > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Taxes </span>
                  <span className="font-medium">${taxes.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-black-600">₹ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-700 shadow-lg hover:shadow-xl'
                } text-black`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;