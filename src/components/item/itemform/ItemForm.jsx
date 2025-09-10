import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import states from "../../../constans/states.json";
import etat from "../../../constans/etat";
import ReactPixel from 'react-facebook-pixel';
import getData from "../../../constans/getData";
import { trackTikTokEvent } from '../../../utility/tiktokPixel';
import { User, Phone } from 'lucide-react';

const ItemForm = ({ item }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { main_color, id, textColor, secondColor } = getData;
    const navigate = useNavigate();
    const formRef = useRef(null);
    const inputRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stateid, setStateid] = useState("0");

    const [Livrition, setLivrition] = useState({ beru: 0, home: 0 });

    const [user, setUser] = useState({
        userId: id,
        name: "",
        phone: "",
        state: "",
        stateNumber: "0",
        city: "",
        ride: 0,
        item: item,
        q: 1,
        price: item.price,
        home: true,
    });

    const totalPrice = useMemo(() => {
        return (user.price * user.q) + (user.home ? Livrition.home : Livrition.beru);
    }, [user.price, user.q, user.home, Livrition]);

    const scrollToForm = useCallback(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        inputRef.current?.focus();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    }, [errors]);

    const handleStateChange = useCallback((e) => {
        const selectedState = e.target.value;
        const selectedStateObj = states.find((state) => state.name === selectedState);
        const stateCode = selectedStateObj?.code || "0";
        setStateid(selectedStateObj?.id || "0");
        setLivrition({
            beru: selectedStateObj?.stop_back || 0,
            home: selectedStateObj?.prix_initial || 0,
        });
        setUser(prev => ({
            ...prev,
            stateNumber: stateCode,
            state: selectedState,
            ride: selectedStateObj?.prix_initial || 0,
        }));
        if (errors.state) setErrors(prev => ({ ...prev, state: "" }));
    }, [errors]);

    const handleCityChange = useCallback((e) => {
        setUser(prev => ({ ...prev, city: e.target.value }));
        if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
    }, [errors]);

    const validateForm = () => {
        const newErrors = {};
        if (!user.name.trim()) newErrors.name = "الاسم الكامل مطلوب";
        if (!user.phone.trim()) {
            newErrors.phone = "رقم الهاتف مطلوب";
        } else if (!/^(\+?213|0)(5|6|7)[0-9]{8}$/.test(user.phone)) {
            newErrors.phone = "رقم هاتف غير صحيح";
        }
        if (!user.state) newErrors.state = "الولاية مطلوبة";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsFormVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (formRef.current) observer.observe(formRef.current);
        return () => formRef.current && observer.unobserve(formRef.current);
    }, []);

    useEffect(() => {
        if (item.Fpixal && !window.fbq) {
            ReactPixel.init(item.Fpixal);
        }
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            scrollToForm();
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(`https://true-fit-dz-api.vercel.app/order`, user);
            if (response.data.good) {
                trackTikTokEvent('CompletePayment', {
                    value: totalPrice,
                    currency: 'DZD',
                    content_type: 'product',
                    content_name: item.name,
                });

                ReactPixel.track('Purchase', {
                    value: totalPrice,
                    currency: 'DZD',
                    content_name: item.name,
                    content_type: 'product',
                });

                navigate("/thanks");
            } else {
                setErrors({ submit: "حدث خطأ أثناء إرسال الطلب" });
            }
        } catch (err) {
            console.error(err);
            setErrors({ submit: "خطأ في الخادم، حاول لاحقًا" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="w-full text-center mt-6">
                <h1 className="text-3xl font-extrabold text-base-content">{item.name}</h1>
                {item.lanImg && (
                    <img
                        src={item.lanImg}
                        alt="منتج"
                        loading="lazy"
                        className="my-3 mx-auto max-w-full max-h-[500px] object-contain rounded-xl shadow"
                    />
                )}
            </div>

            <div
                ref={formRef}
                className="w-full sm:w-[95%] md:w-[80%] lg:w-[60%] mx-auto mt-10 p-6 md:p-8 rounded-2xl shadow-2xl border border-base-700 bg-base-100 font-[Cairo]"
            >
                <h2 className="text-center text-2xl font-bold text-base-content">املأ النموذج لإتمام الطلب</h2>
                {errors.submit && <p className="text-error text-center mt-2">{errors.submit}</p>}

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <label className="input">
                        <User />
                        <input
                            ref={inputRef}
                            id="name"
                            name="name"
                            type="text"
                            value={user.name}
                            onChange={handleChange}
                            className={`input input-bordered focus:outline-none w-full ${errors.name && "input-error"}`}
                            placeholder="الاسم"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <span className="text-error text-sm">{errors.name}</span>}
                    </label>

                    <label className="input">
                        <Phone />
                        <input
                            id="phone"
                            name="phone"
                            type="number"
                            value={user.phone}
                            onChange={handleChange}
                            className={`input placeholder:mr-auto input-bordered w-full ${errors.phone && "input-error"}`}
                            placeholder="رقم الهاتف"
                            aria-invalid={!!errors.phone}
                        />
                        {errors.phone && <span className="text-error text-sm">{errors.phone}</span>}
                    </label>


                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">مكان التوصيل</span>
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                name="state"
                                value={user.state}
                                onChange={handleStateChange}
                                className={`select select-bordered w-full ${errors.state && "select-error"}`}
                            >
                                <option value="">اختر الولاية</option>
                                {states.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.ar_name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="city"
                                value={user.city}
                                onChange={handleCityChange}
                                disabled={!etat.some((c) => c.state_code == stateid)}
                                className="select select-bordered w-full"
                            >
                                <option value="">اختر المدينة</option>
                                {etat
                                    .filter((c) => c.state_code == stateid)
                                    .map((c, i) => (
                                        <option key={i} value={c.name}>
                                            {c.ar_name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        {errors.state && <span className="text-error text-sm mt-2">{errors.state}</span>}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-3">مكان التوصيل</h3>
                        <div className="space-y-3">
                            <DeliveryOption
                                label="إلى المنزل"
                                selected={user.home}
                                price={Livrition.home}
                                onClick={() => setUser((prev) => ({ ...prev, home: true, ride: Livrition.home }))}
                                secondColor={secondColor}
                            />
                            <DeliveryOption
                                label="إلى مكتب التوصيل"
                                selected={!user.home}
                                price={Livrition.beru}
                                onClick={() => setUser((prev) => ({ ...prev, home: false, ride: Livrition.beru }))}
                                secondColor={secondColor}
                            />
                        </div>
                    </div>

                    <div className="text-sm space-y-2 bg-base-200 p-4 rounded-xl shadow-inner">
                        <div className="flex justify-between">
                            <span>سعر التوصيل</span>
                            <span className="font-bold text-primary">
                                {user.state ? (user.home ? Livrition.home : Livrition.beru) + " دج" : "اختر الولاية"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>ثمن المنتجات</span>
                            <span className="font-bold">{user.price * user.q} دج</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>الإجمالي</span>
                            <span className="text-primary">{totalPrice} دج</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            type="button"
                            onClick={() => setUser((prev) => ({ ...prev, q: Math.max(1, prev.q - 1) }))}
                            className="btn btn-outline btn-circle btn-sm text-xl"
                        >
                            −
                        </button>
                        <span className="text-2xl font-extrabold">{user.q}</span>
                        <button
                            type="button"
                            onClick={() => setUser((prev) => ({ ...prev, q: prev.q + 1 }))}
                            className="btn btn-outline btn-circle btn-sm text-xl"
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn w-full mt-6 btn-primary"
                        style={{ backgroundColor: main_color, color: textColor }}
                    >
                        {isSubmitting ? "جاري المعالجة..." : "اطلب الآن"}
                    </button>
                </form>
            </div>

            <div className="text-center mt-10 text-base-content font-[Cairo]">
                <p>{item.sTitel}</p>
            </div>

            {!isFormVisible && (
                <button
                    onClick={scrollToForm}
                    className="fixed bottom-4 right-4 left-4 md:right-10 md:left-auto btn font-bold shadow-lg z-50"
                    style={{ backgroundColor: main_color, color: textColor }}
                >
                    اشترِ الآن
                </button>
            )}
        </>
    );
};

const DeliveryOption = ({ label, selected, price, onClick, secondColor }) => (
    <div
        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selected ? "ring-2 ring-offset-2" : "hover:bg-base-200"}`}
        style={{
            borderColor: selected ? secondColor : "#e5e7eb",
            backgroundColor: selected ? `${secondColor}22` : "transparent"
        }}
        onClick={onClick}
    >
        <div className="flex items-center gap-3">
            <input
                type="radio"
                readOnly
                checked={selected}
                className="radio"
                style={{ accentColor: secondColor }}
            />
            <span className="text-base font-medium">{label}</span>
        </div>
        <span className="font-bold text-base">{price} دج</span>
    </div>
);

export default ItemForm;
