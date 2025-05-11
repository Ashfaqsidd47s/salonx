import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faqs() {
  const faqs = [
    {
      question: "How long will it take to build the application?",
      answer:
        "The time required to build an application can vary significantly depending on various factors such as the complexity of the application, the size of the development team, the availability of resources, and the project management approach.",
    },
    {
      question: "Will you be hiring developers or using an internal team?",
      answer:
        "The decision to hire developers or use an internal team depends on the project requirements, budget, and timeline. Hiring external developers can provide specialized expertise and flexibility, while an internal team offers better control and alignment with company culture. A hybrid approach, combining both, is also common to balance cost and efficiency.",
    },
    {
      question: "What are the benefits of mobile app development for businesses?",
      answer:
        "Mobile app development offers businesses enhanced customer engagement, increased brand visibility, and improved accessibility. Apps enable personalized experiences, streamline operations, boost customer loyalty through features like push notifications, and provide a competitive edge in the digital market.",
    },
    {
      question: "How much does it cost to develop a mobile application?",
      answer:
        "The cost of developing a mobile application varies widely based on factors like app complexity, platform (iOS, Android, or both), design requirements, and features (e.g., backend integration, third-party APIs). Basic apps may cost $10,000–$50,000, while complex apps with advanced functionality can range from $50,000 to $150,000 or more.",
    },
    {
      question: "How do I choose the right mobile app development service provider?",
      answer:
        "To choose the right mobile app development service provider, evaluate their portfolio for relevant experience, check client reviews and testimonials, and assess their technical expertise in your desired platforms and technologies. Ensure they offer clear communication, a transparent development process, and post-launch support. Comparing costs and timelines while prioritizing quality is also key.",
    },
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className=" max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Frequently asked questions
          </h2>
          <p className="text-gray-500">
            Ask everything you need to know about our products and services.
            <br />
            We are ready to answer all your questions.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-md"
            >
              <AccordionTrigger className="px-4 py-3 text-left text-xl items-center text-gray-900 font-medium hover:bg-gray-100 rounded-t-xl">
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center">
          <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            VIEW MORE
          </button>
        </div>
      </div>
    </section>
  );
}