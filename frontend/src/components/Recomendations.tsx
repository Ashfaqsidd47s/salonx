import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaClock, FaStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

const dummyData = [
        {
            id:1,
            name: 'LuxeLocks Salon & Spa',
            type: 'Unisex',
            rating: 4.25,
            address: '6391 Elgin St, Delaware 10299',
            hours: '9:00 am - 7:00 pm',
            distance: '6.5 km',
            image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
            id:2,
            name: 'Serenity Strands Salon',
            type: 'Male',
            rating: 4.25,
            address: '1901 Thornridge Cir, Shiloh, Hawaii',
            hours: '9:00 am - 7:00 pm',
            distance: '9 km',
            image: "https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
            id:3,
            name: 'VelvetVibe Salon Lounge',
            type: 'Female',
            rating: 4.25,
            address: '6391 Elgin St, Celina, Delaware',
            hours: '9:00 am - 7:00 pm',
            distance: '12 km',
            image: "https://images.pexels.com/photos/19679199/pexels-photo-19679199/free-photo-of-applying-makeup-to-bride-in-traditional-clothing.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        },
        {
            id:4,
            name: 'Lumina Lux',
            type: 'Female',
            rating: 4.25,
            address: '2972 Westheimer Rd, Santa Ana',
            hours: '9:00 am - 7:00 pm',
            distance: '15 km',
            image: "https://images.pexels.com/photos/3738359/pexels-photo-3738359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        }
];

export default function Recomendations() {
    const [recomendations, setRecomendations] = useState(dummyData);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/salon/recommendations");
            setRecomendations(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recommended</h2>
                <div className="flex gap-2">
                <button className="p-2 rounded-full border hover:bg-gray-50">
                    <FaChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full border hover:bg-gray-50">
                    <FaChevronRight className="h-5 w-5" />
                </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 items-center gap-6">
                {recomendations.map((salon, index) => (
                    <Link to={`/explore/${salon.id}`} key={index}>
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="relative">
                            <img
                                src={salon.image}
                                alt={salon.name}
                                className="w-full h-48 object-cover"
                            />
                            <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${
                                salon.type === 'Unisex' ? 'bg-purple-500' :
                                salon.type === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                            }`}>
                                {salon.type}
                            </span>
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-full px-2 py-1">
                                <FaStar className="h-4 w-4 fill-current text-yellow-400" />
                                <span className="text-sm font-medium">{salon.rating}</span>
                            </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium mb-2">{salon.name}</h3>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin className="h-4 w-4" />
                                        <span>{salon.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaClock className="h-4 w-4" />
                                        <span>{salon.hours}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">{salon.distance}</span>
                                        <span>•</span>
                                        <span className="text-green-500">Open</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            </div>
        </section>
    )
}
