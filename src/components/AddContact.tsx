import React, { useState } from "react";
import axios from 'axios';
import { IContact } from "./IContact";

type AddContactProps = {
  reload: () => void;
  contacts: IContact[];
};

const AddContact: React.FC<AddContactProps> = ({ reload, contacts }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !phone || !name) {
      alert('Please input all fields');
      return;
    }

    const found = contacts.find((x: IContact) => x.phone === phone);
    if (found) {
      alert("This phone is already existed.");
      return;
    }    

    try {
      const filename = encodeURIComponent(image.name);
      const contentType = image.type;

      // Send POST request to API Gateway
      const url = process.env.REACT_APP_API_CREATE_CONTACT_URL || "";
      const response = await axios.post(
        url,
        { filename, contentType, phone, name }
      );

      const { uploadURL } = response.data;
      // Upload the file to S3 using the pre-signed URL
      await axios.put(uploadURL, image, {
        headers: { 'Content-Type': image.type },
      });

      reload();
      setName("");
      setPhone("");
      setImage(null);
      setPreview(null);

    } catch (error) {
      console.log("error: ", error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-2">Add Contact</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="file" onChange={handleFileChange}
        key={image ? image.name : 'reset'}
        className="border p-2 mb-2 w-full rounded"
      />
      {preview && (
        <div className="mb-3 flex justify-center">
          <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg border border-gray-300 object-cover" />
        </div>
      )}
      <button type="button" className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleSubmit}>
        Add Contact
      </button>
    </div>
  );
};

export default AddContact;
