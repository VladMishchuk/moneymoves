import AddAccountForm from "../components/accounts/AddAccountForm";
import AccountsList from "../components/accounts/AccountsList";
import Header from "../components/Header";

export default function Categories() {
  return (
    <>
      <Header />
      <main>
        <AddAccountForm />
        <AccountsList />
      </main>
    </>
  );
}
