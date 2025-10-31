import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/App.routes.jsx";


function App() {
  return (
    <ThemeProvider>
<Toaster position="top-right" reverseOrder={false} />
        <AppRoutes />

    </ThemeProvider>
  );
}

export default App;