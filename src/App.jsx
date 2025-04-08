import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSettings } from '@/providers/SettingsProvider';
import { AppRouting } from '@/routing';
import { PathnameProvider } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
const {
  BASE_URL
} = import.meta.env;
const App = () => {
  const {
    settings
  } = useSettings();
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);
  return <BrowserRouter basename={BASE_URL} future={{
    v7_relativeSplatPath: true,
    v7_startTransition: true
  }}>
      <Provider store={store}>
      <PersistGate
       loading={null} persistor={persistor}>
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
        </PersistGate>
      </Provider>
      <Toaster />
    </BrowserRouter>;
};
export { App };