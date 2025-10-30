// src/pages/BookingResult.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, Clock, Users, DollarSign } from 'lucide-react';

interface ResultState {
  status: 'success' | 'failure';
  bookingId?: string;
  experience?: string;
  date?: string;
  time?: string;
  quantity?: number;
  total?: string;
}

const BookingResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as ResultState;

  if (!result) {
    navigate('/');
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {result.status === 'success' ? (
          // Success State
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-gray-600">
                Your experience has been successfully booked
              </p>
            </div>

            {/* Booking ID */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-sm font-medium text-black mb-2">Booking Reference</p>
              {result.bookingId ? (
                <>
                  <p className="text-3xl font-bold text-black tracking-wider">
                    {result.bookingId}
                  </p>
                  <p className="text-sm text-black mt-2">
                    Save this reference number for your records
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-600">
                  Your booking was successful but a reference number could not be generated. 
                  Please contact support with your booking details.
                </p>
              )}
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-black mt-1 " />
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-lg font-semibold text-gray-900">{result.experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-black mt-1 " />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg text-gray-900">{formatDate(result.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg text-gray-900">{result.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Users className="w-6 h-6 text-black mt-1 " />
                <div>
                  <p className="text-sm font-medium text-gray-500">Guests</p>
                  <p className="text-lg text-gray-900">{result.quantity} guest{result.quantity && result.quantity > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-black mt-1 " />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Paid</p>
                  <p className="text-lg font-semibold text-gray-900">${result.total}</p>
                </div>
              </div>
            </div>

            {/* Confirmation Email Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">
                📧 A confirmation email has been sent to your email address with all the details and instructions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Book Another Experience
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all"
              >
                Print Confirmation
              </button>
            </div>
          </div>
        ) : (
          // Failure State
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Booking Failed
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Unfortunately, we couldn't process your booking
              </p>
            </div>

            {/* Error Message */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
              <p className="text-red-800 mb-2">
                <strong>What went wrong?</strong>
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Payment processing error</li>
                <li>Network connection issue</li>
                <li>The selected time slot may no longer be available</li>
              </ul>
            </div>

            {/* Support Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-sm font-medium text-blue-900 mb-2">Need Help?</p>
              <p className="text-sm text-blue-800">
                Contact our support team at <strong>support@experiences.com</strong> or call <strong>1-800-EXP-HELP</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingResult;