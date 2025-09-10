import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPixel from "react-facebook-pixel";
import ItemForm from "../components/item/itemform/ItemForm";
import ItemImages from "../components/item/itemimgs/ItemImages";
import items from "../item.json";

let pixelInitialized = false;

const Item = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Find item safely
        const foundItem = items.find((e) => e._id === id);
        if (!foundItem) return; // early exit if item not found
        setItem(foundItem);

        // Initialize Pixel only once
        if (foundItem.Fpixal && !pixelInitialized) {
            ReactPixel.init(foundItem.Fpixal, {}, { debug: false });
            pixelInitialized = true;
        }

        // Always track view
        if (foundItem.Fpixal) {
            ReactPixel.pageView();
            ReactPixel.track("ViewContent", {
                content_name: foundItem.name,
                content_ids: [foundItem._id],
                content_type: "product",
                value: foundItem.price,
                currency: "DZD",
            });
        }
    }, [id]);

    if (!item) {
        return (
            <div className="w-full text-center py-10 text-lg font-semibold text-gray-600">
                المنتج غير موجود أو تم حذفه
            </div>
        );
    }

    return (
        <div className="w-full flex flex-row-reverse flex-wrap justify-center px-5 mb-5 overflow-hidden">
            <ItemImages imgs={item.imgs} />
            <ItemForm item={item} />
        </div>
    );
};

export default Item;
