import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { useAuth } from "../../hooks/auth/useAuth";
import { useUpdateCategory } from "../../hooks/categories/useUpdateCategory";
import { useRemoveCategory } from "../../hooks/categories/useRemoveCategory";
import Loader from "../Loader";

export default function CategoriesList() {
  const { currentUser } = useAuth();
  const { categories, loading } = useGetCategories(currentUser?.uid, true);
  const { updateCategory } = useUpdateCategory();
  const { removeCategory } = useRemoveCategory();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {categories.length > 0 ? (
        <table className="categoriesTable">
          <thead>
            <tr>
              <th>category</th>
              <th>sum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <input
                    className="categoriesTable-input"
                    type="text"
                    placeholder="enter category name"
                    value={category.name}
                    onChange={(e) =>
                      updateCategory(category.id, { name: e.target.value })
                    }
                  />
                </td>
                <td>
                  <span className="categoriesTable-span">
                    {category.balance}
                  </span>
                </td>
                <td>
                  <button
                    className="categoriesTable-remove"
                    onClick={() => removeCategory(category.id)}
                  >
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="categoriesTable-remove-svg"
                    >
                      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No categories</p>
      )}
    </>
  );
}
