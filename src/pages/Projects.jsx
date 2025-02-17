import AddCategoryForm from "../components/categories/AddCategoryForm";
import CategoriesList from "../components/categories/CategoriesList";
import Header from "../components/Header";

export default function Projects() {
  return (
    <>
      <Header />
      <main>
        Project
        <AddCategoryForm />
        <CategoriesList />
      </main>
    </>
  );
}
