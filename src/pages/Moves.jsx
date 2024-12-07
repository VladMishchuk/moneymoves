import AddMoveForm from "../components/moves/AddMoveForm";
import MovesList from "../components/moves/MovesList";
import Header from "../components/Header";

export default function Moves() {
  return (
    <>
      <Header />
      <main>
        <AddMoveForm />
        <MovesList />
      </main>
    </>
  );
}
