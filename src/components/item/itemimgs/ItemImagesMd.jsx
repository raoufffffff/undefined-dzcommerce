import 'react-photo-view/dist/react-photo-view.css';
import { useRef, useState, useCallback, lazy, Suspense } from 'react';


const PhotoSlider = lazy(() =>
    import('react-photo-view').then((mod) => ({ default: mod.PhotoSlider }))
);

const ItemImagesMd = ({ imgs }) => {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    return (
        <div
            className='hidden md:flex flex-wrap w-5/12 gap-1.5'
        >
            {imgs.map((e, i) => (
                <img
                    onClick={() => {
                        setVisible(true);
                        setIndex(i);
                    }}
                    className={i == 0 ? "w-full" : "w-[48%]"}
                    src={e} />
            ))}
            <Suspense fallback={null}>
                {visible && (
                    <PhotoSlider
                        images={imgs.map((src) => ({ src, key: src }))}
                        visible={visible}
                        onClose={() => setVisible(false)}
                        index={index}
                        onIndexChange={setIndex}
                    />
                )}
            </Suspense>
        </div>
    )
}

export default ItemImagesMd