import { useState } from "react";
import axios from "axios";

interface SignupFormState {
  emailid: string;
  pwd: string;
  dos: string;
  profilepic: File | null;
}

const INITIAL_STATE: SignupFormState = {
  emailid: "",
  pwd: "",
  dos: "",
  profilepic: null
};

export default function Signup_pic() {
  const [form, setForm] = useState<SignupFormState>(INITIAL_STATE);
  const [prev, setPrev] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    let url = "http://localhost:2005/user/signupwithpic";
    let frmData = new FormData();
    frmData.append("emailid", form.emailid);
    frmData.append("pwd", form.pwd);
    frmData.append("dos", form.dos);
    if (form.profilepic)
      frmData.append("profilepic", form.profilepic);



    let response = await axios.post(url, frmData, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert(JSON.stringify(response))
  };

  function updatePicAndSetPreview(event: React.ChangeEvent<HTMLFormElement>) {
    let selFileObj = event.target.files[0];

    if (selFileObj) {
      setForm((prev) => (
        { ...prev, ["profilepic"]: selFileObj }))

      const prevObj = URL.createObjectURL(selFileObj);
      setPrev(prevObj)
    }
  }

  const handleUpdate = async () => {
    let url = "http://localhost:2005/user/updateaxioswithpic";

    const frmData = new FormData();
    frmData.append("emailid", form.emailid);
    frmData.append("pwd", form.pwd);
    frmData.append("dos", form.dos);

    if (form.profilepic) {
      frmData.append("profilepic", form.profilepic);
    }

    const response = await axios.put(url, frmData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(JSON.stringify(response.data));
  };


  const handleDelete = async () => {
    let url = "http://localhost:2005/user/deleteaxioswithpic";
    let response = await axios.delete(url, {
      data: form,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    alert(JSON.stringify(response));
  };

  const handleFind = async () => {
    let url = "http://localhost:2005/user/findaxioswithpic";

    const response = await axios.post(url, {
      emailid: form.emailid,
    });

    if (response.data.status) {
      const doc = response.data.doc;

      setForm({
        emailid: doc.emailid,
        pwd: doc.pwd,
        dos: doc.dos ? doc.dos.split("T")[0] : "" ,
        profilepic: null, // keep null; pic comes from URL
      });

      setPrev(doc.picurl || null); // show image from cloudinary
    } else {
      alert("User not found");
      setPrev(null);
    }
  };


  return (
    <main className="min-h-screen grid place-items-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">
          Create Account
        </h1>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="email"
              name="emailid"
              value={form.emailid}
              onChange={handleChange}
              placeholder="Email address"
              className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleFind}
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Find
            </button>
          </div>

          <input
            type="password"
            name="pwd"
            value={form.pwd}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            name="dos"
            value={form.dos}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />


          <input type="file" name="profilepic" onChange={updatePicAndSetPreview}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"></input>
          <center>
            <img src={prev} alt="" className="w-[100px] h-28 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </center>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          Sign Up
        </button>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleUpdate}
            className="w-full rounded-lg bg-green-600 py-2 font-medium text-white hover:bg-green-700"
          >
            Update
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full rounded-lg bg-red-600 py-2 font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </main>
  );
}
