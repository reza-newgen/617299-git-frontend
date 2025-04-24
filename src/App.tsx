import React, { useEffect, useState } from "react";
import "./App.css";
import AddContact from "./components/AddContact";
import { IContact } from "./components/IContact";
import ContactList from "./components/ContactList";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const reload = async () => {
    try {
      const url = process.env.REACT_APP_API_GET_CONTACT_URL || "";
      const response = await axios.get(url);
      setContacts(response.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    reload();
  }, [])
  return (
    <div>
      <AddContact reload={reload} contacts={contacts} />
      <hr />
      <ContactList contacts={contacts} />
    </div>
  );
}

export default App;
