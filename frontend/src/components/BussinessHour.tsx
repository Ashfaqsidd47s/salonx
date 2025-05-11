// Define TypeScript interfaces for the business hours data
interface BusinessHoursDay {
  open: boolean;
  start: string;
  end: string;
}

interface BusinessHoursData {
  [day: string]: BusinessHoursDay;
}

interface BusinessHoursProps {
  businessHours: BusinessHoursData;
}

const BusinessHours: React.FC<BusinessHoursProps> = ({ businessHours }) => {
  // Get today's day to highlight it (e.g., Monday)
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Hours</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(businessHours).map(([day, hours]: [string, BusinessHoursDay]) => {
          const isToday = day === today;
          const isOpen = hours.open;

          return (
            <div
              key={day}
              className={`flex justify-between items-center p-3 border rounded-lg shadow-sm transition-colors ${
                isToday
                  ? 'border-amber-300 bg-amber-50'
                  : isOpen
                  ? 'border-green-500 bg-green-100'
                  : 'border-gray-200 bg-gray-100'
              }`}
            >
              <span
                className={`font-medium ${
                  isToday ? 'text-amber-700' : isOpen ? 'text-green-900' : 'text-gray-600'
                }`}
              >
                {day}
              </span>
              <span
                className={isOpen ? 'text-green-600 font-medium' : 'text-gray-500'}
              >
                {hours.open ? `${hours.start} - ${hours.end}` : 'Closed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessHours;