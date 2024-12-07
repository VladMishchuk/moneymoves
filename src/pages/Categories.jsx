import AddCategoryForm from "../components/categories/AddCategoryForm";
import CategoriesList from "../components/categories/CategoriesList";
import Header from "../components/Header";

export default function Categories() {
  return (
    <>
      <Header />
      <main>
        <AddCategoryForm />
        <CategoriesList />
      </main>
    </>
  );
}
