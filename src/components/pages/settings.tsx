import { useEffect, useState } from "react"
import { updateUserPassword } from "../../firebase/auth.action";

export default function Settings() {
  const user = localStorage.getItem('user');
  const currUser = JSON.parse(user!);
  const [password, setPassword] = useState('');
  const [editPassword, setEditPassword] = useState(false);
  const [message, setMessage] = useState('');
  const handleChangePassword = async () => {
    try {
     await updateUserPassword( currUser?.id,password);
     setMessage('Password updated successfully');
     setPassword('');
     setEditPassword(false);
    } catch (error) {
      console.log(error);
      return
    }
  }
  useEffect(() => {
    if(message){
      setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  }, [message])
  return (
    <main className="flex-1 flex gap-4 border border-pre rounded-md py-2 px-4">
      <div className="w-1/2 flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Account Details</h1>
        <p > <span className="text-black dark:text-white font-bold">Admin Email:</span> {currUser?.email} </p>
        <span className="text-[#930938]  w-fit cursor-pointer"
        onClick={() => setEditPassword((prev)=> !prev)}
        >update password</span>
        {
          editPassword && (
            <div className="flex flex-col gap-2 mt-2">
        <div className="relative">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password:
          </label>
          <input
            type={'text'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="appearance-none w-full px-4 py-2 pr-10 rounded border border-[#6b4f9a] dark:bg-[#19001c] focus:outline-none focus:ring-2 focus:ring-[#a07be1]"
          />
          <button
            onClick={handleChangePassword}
            className={`
        h-12 w-full mt-4 text-white  rounded-sm flex items-center  justify-center 
        bg-purple-950/50 hover:bg-purple-950 cursor-pointer
        `}>
            Update password
          </button>
        </div>
        </div>
          )
        }
        <p className="font-bold py-8 text-[#930938] text-xl">{message ? message : ''}</p>
      </div>
    </main>
  )
}
