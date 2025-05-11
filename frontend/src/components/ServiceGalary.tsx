
const serviceMenuItems = [
    {
      image: 'https://images.pexels.com/photos/8090137/pexels-photo-8090137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      image: 'https://images.pexels.com/photos/7290698/pexels-photo-7290698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      image: 'https://images.pexels.com/photos/7290709/pexels-photo-7290709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      image: 'https://images.pexels.com/photos/7290722/pexels-photo-7290722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];
  
const galleryImages = [
    'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];
const ServiceGallery = () => {
  return (
    <section className="mt-16 mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Service Menu</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {serviceMenuItems.map((item, index) => (
          <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <img 
              src={item.image} 
              alt={`Service Menu ${index + 1}`} 
              className="w-full h-32 md:h-40 object-cover"
            />
          </div>
        ))}
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Salon Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 row-span-2">
          <img 
            src="https://images.pexels.com/photos/3998429/pexels-photo-3998429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Hair Styling" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {galleryImages.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg">
            <img 
              src={image} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceGallery;