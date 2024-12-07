import { useGetMoves } from "../../hooks/moves/useGetMoves";
import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { useAuth } from "../../hooks/auth/useAuth";
import { useUpdateMove } from "../../hooks/moves/useUpdateMove";
import { useRemoveMove } from "../../hooks/moves/useRemoveMove";
import { useAddCategory } from "../../hooks/categories/useAddCategory";
import CreatableSelect from "react-select/creatable";
import Loader from "../Loader";
import { Timestamp } from "@firebase/firestore";

export default function MovesList() {
  const { currentUser } = useAuth();
  const { moves, loading } = useGetMoves(currentUser?.uid);
  const { categories, loading: categoriesLoading } = useGetCategories(
    currentUser?.uid
  );
  const { updateMove } = useUpdateMove();
  const { removeMove } = useRemoveMove();
  const { addCategory } = useAddCategory();

  const handleCategoryChange = async (moveId, selectedOption) => {
    if (!selectedOption) return;
    let categoryId;
    if (selectedOption.__isNew__) {
      console.log("here")
      const newCategory = await addCategory({
        user: currentUser.uid,
        name: selectedOption.label,
      });
      categoryId = newCategory.id;
    } else {
      categoryId = selectedOption.value;
    }
    updateMove(moveId, { category: categoryId });
  };

  if (loading || categoriesLoading) {
    return <Loader />;
  }

  return (
    <>
      {moves.length > 0 ? (
        <table className="movesTable">
          <thead>
            <tr>
              <th>date</th>
              <th>sum</th>
              <th>category</th>
              <th colSpan="2">description</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move) => {
              const categoryById = categories.find(
                (category) => category.id === move.category
              );
              const category = categoryById ? categoryById.name : "";

              return (
                <tr key={move.id}>
                  <td>
                    <input
                      className="movesTable-input"
                      type="date"
                      value={
                        new Date(move.date.seconds * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        updateMove(move.id, {
                          date: Timestamp.fromDate(new Date(e.target.value)),
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                    placeholder="enter move sum"
                      className="movesTable-input"
                      type="number"
                      value={move.sum}
                      onChange={(e) =>
                        updateMove(move.id, {
                          sum: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td>
                    <CreatableSelect
                      isClearable
                      value={{ value: move.category, label: category }}
                      onChange={(selectedOption) =>
                        handleCategoryChange(move.id, selectedOption)
                      }
                      options={categories.map((category) => ({
                        value: category.id,
                        label: category.name,
                      }))}
                      styles={{
                        control: (stales) => ({
                          ...stales,
                          border: "1px solid #ddd",
                          borderRadius: 0,
                        }),
                        clearIndicator: (stales) => ({
                          ...stales,
                          display: "none",
                        }),                        
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="movesTable-input"
                      type="text"
                      value={move.description}
                      onChange={(e) =>
                        updateMove(move.id, {
                          description: e.target.value || "",
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="movesTable-remove"
                      onClick={() => removeMove(move.id)}
                    >
                      <svg
                        height="20"
                        width="20"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        focusable="false"
                        className="movesTable-remove-svg"
                      >
                        <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No moves</p>
      )}
    </>
  );
}
