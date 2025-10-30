
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
// Experience type intentionally not used here to allow flexible backend shape
interface TimeSlot {
  slotTime: string;
}

interface ScheduledDate {
  scheduledDate: string;
  timeSlots: TimeSlot[];
}



const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedDateIso, setSelectedDateIso] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    console.log(setSelectedDateIso);
    const fetchExperience = async () => {
      try {
        const response = await fetch(`https://bookit-node.onrender.com/api/experiences/${id}`);
        console.log(response)
        const data = await response.json();
        console.log(data);
        setExperience(data.data);

        // // Mock data
        // const mockExperience: Experience = {
        //   id: id || '1',
        //   name: 'Sunset Yoga Session',
        //   description: 'Join us for an unforgettable yoga experience as the sun sets over the ocean. This 90-minute session combines gentle stretching, mindful breathing, and meditation to help you find inner peace and rejuvenation.',
        //   image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop',
        //   price: 45,
        //   duration: '90 mins',
        //   category: 'Wellness',
        //   rating: 4.8,
        //   availableDates: [
        //     new Date('2025-11-05'),
        //     new Date('2025-11-06'),
        //     new Date('2025-11-07'),
        //     new Date('2025-11-08'),
        //     new Date('2025-11-12'),
        //     new Date('2025-11-13')
        //   ],
        //   availableSlots: ['06:00 AM', '07:00 AM', '05:30 PM', '06:30 PM']
        // };

        // setExperience(mockExperience);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experience:', error);
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    navigate('/checkout', {
      state: {
        experience,
        date: selectedDateIso || (selectedDate?.scheduledDate || ''),
        time: selectedTime,
        quantity
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-500">Experience not found</p>
      </div>
    );
  }

  const totalCost = experience.pricePerPerson * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            ← Back to Experiences
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Experience Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={experience.coverPhoto}
                alt={experience.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Title and Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
                  {experience.category}
                </span>
                {experience.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{experience.rating}</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {experience.title}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{experience.fullDescription}</p>
            </div>

            {/* Available Dates */}
            {/* Available Dates */}
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Calendar className="w-6 h-6" />
    Available Dates
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {experience.scheduledDates?.map((item: ScheduledDate, index: number) => {
      const dateObj = new Date(item.scheduledDate);
      const displayDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return (
        <button
          key={index}
          onClick={() => setSelectedDate(item)}
          className={`p-3 rounded-lg border-2 text-center transition-all ${
            selectedDate?.scheduledDate === item.scheduledDate
              ? 'border-yellow-800 bg-yellow-600 text-black'
              : 'border-gray-200 hover:border-yellow-800'
          }`}
        >
          {displayDate}
        </button>
      );
    })}
  </div>
</div>

{/* Available Time Slots */}
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Clock className="w-6 h-6" />
    Available Time Slots
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {selectedDate?.timeSlots?.map((slot: TimeSlot, index: number) => (
      <button
        key={index}
        onClick={() => setSelectedTime(slot.slotTime)}
        className={`p-3 rounded-lg border-2 text-center transition-all ${
          selectedTime === slot.slotTime
            ? 'border-yellow-700 bg-yellow-600 text-black'
            : 'border-gray-200 hover:border-yellow-800'
        }`}
      >
        {slot.slotTime}
      </button>
    ))}
  </div>
</div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-black" />
                  <span>Duration: {experience.timeLength}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-black" />
                  <span>Location will be shared after booking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-black" />
                  <span>Small group experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Cost Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-yellow-600 flex items-center justify-center text-xl font-semibold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 hover:yellow-blue-600 flex items-center justify-center text-xl font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>₹{experience.pricePerPerson} × {quantity} guest{quantity > 1 ? 's' : ''}</span>
                  <span className="font-medium">₹{totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">Total Cost</span>
                  <span className="text-3xl font-bold text-black">₹{totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleContinue}
                disabled={!selectedDate || !selectedTime}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-yellow-700 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Checkout
              </button>

              {(!selectedDate || !selectedTime) && (
                <p className="text-sm text-red-500 mt-3 text-center">
                  Please select date and time to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetails;