import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router"
import Game from "./Game"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Game/>} />
      </Routes>
      <Toaster toastOptions={{
        className: "",
        style: {
          fontSize: "13px"
        }
      }}/>
    </>
  )
}

export default App