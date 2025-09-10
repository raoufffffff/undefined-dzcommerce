import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import getData from "../../constans/getData";
import { useState } from "react";

const ItemCard = ({ item }) => {
  const [isHovering, setIsHovering] = useState(false);
  const { main_color, textColor } = getData;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="mx-2 overflow-hidden my-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link
        to={`/item/${item._id}`}
        className="flex flex-col items-center justify-between h-full bg-white"
      >
        {/* Product Image with modern styling */}
        <div className="relative w-full aspect-square overflow-hidden group">
          <img
            src={item.imgs[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="w-full p-4 space-y-2">
          {/* Product Name */}
          <h3 className="text-center text-gray-800 font-bold text-sm line-clamp-2 h-10">
            {item.name}
          </h3>

          {/* Price */}
          <p className="text-center text-lg font-bold text-gray-900">
            {item.price} دج
          </p>

          {/* Order Button */}
          <motion.div
            style={{
              backgroundColor: isHovering ? main_color : "transparent",
              border: `1.5px solid ${main_color}`,
              color: isHovering ? textColor : main_color,
            }}
            className="w-full mt-2 uppercase font-bold text-sm text-center py-2.5 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            اطلب الآن
          </motion.div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ItemCard;