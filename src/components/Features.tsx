import { motion } from "framer-motion";

const features = [
  {
    title: "Thoughtful Design",
    description: "Every detail carefully considered and refined to perfection.",
  },
  {
    title: "Seamless Experience",
    description: "Intuitive interactions that feel natural and effortless.",
  },
  {
    title: "Premium Quality",
    description: "Built with precision using the finest modern technologies.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;