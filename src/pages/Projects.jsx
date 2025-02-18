import AddProjectForm from "../components/projects/AddProjectForm";
import ProjectsList from "../components/projects/ProjectsList";
import Header from "../components/Header";

export default function Projects() {
  return (
    <>
      <Header />
      <main>
        <AddProjectForm />
        <ProjectsList />
      </main>
    </>
  );
}
