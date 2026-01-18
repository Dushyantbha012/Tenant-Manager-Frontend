import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ViewModeProvider } from './context/ViewModeContext';
import router from './router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ViewModeProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </ViewModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
