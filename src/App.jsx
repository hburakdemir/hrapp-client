import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/App.routes.jsx";

function App() {
  return (
    <ThemeProvider>

        <AppRoutes />
    {/* <Toaster position="top-center" reverseOrder={false}> */}
    </ThemeProvider>
  );
}

export default App;