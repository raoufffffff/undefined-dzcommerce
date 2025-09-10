import { Link } from "react-router-dom"
import categories from '../../categories.json'

const MinCategories = ({ hide }) => {

    if (categories.length == 0) return
    return (
        <div
            className="w-full"
        >
            <strong>تصنيفات المتجر</strong>
            <div
                className="flex w-full flex-wrap items-center justify-between"
            >

                {categories.map(e => (
                    <Link
                        className="flex capitalize justify-center  font-bold w-6/12 my-1.5"
                        to={`/categories/${e.name}`}
                        onClick={hide}
                    >
                        {e.name}
                    </Link>
                ))}

            </div>
        </div>
    )
}

export default MinCategories