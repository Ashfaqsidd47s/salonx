import { IoIosMail } from "react-icons/io";
import { FaPhone, FaHeart } from "react-icons/fa";

// Define the TypeScript interface for the data prop
interface SalonData {
  name: string;
  description: string;
  email: string;
  phone: string;
  distance: string;
}

interface SalonInfoProps {
  data: SalonData | null;
}

const SalonInfo: React.FC<SalonInfoProps> = ({ data }) => {
  // Skeleton Component (Shadcn UI style)
  const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
  );

  // If data is null, show skeleton placeholders
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <Skeleton className="h-9 md:h-10 w-3/4 md:w-1/2" />

          <div className="flex mt-4 md:mt-0 space-x-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>

        <div className="mb-8">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex items-center">
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-800">
          {data.name}
        </h1>

        <div className="flex mt-4 md:mt-0 space-x-2">
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
            FOLLOW
          </button>
          <button className="border border-gray-300 p-2 rounded-md">
            <FaHeart className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      <p className=" text-gray-500" >{data.description || " This is wonderfull salon plese come and join us"}</p>

      <div className="mb-8">
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-700">
          <IoIosMail className="h-5 w-5 mr-2 text-gray-600" />
          <span>{data.email}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FaPhone className="h-5 w-5 mr-2 text-gray-600" />
          <span>{data.phone}</span>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="flex items-center">
          <span className="text-gray-500 text-sm">{data.distance}</span>
        </div>
      </div>
    </div>
  );
};

export default SalonInfo;