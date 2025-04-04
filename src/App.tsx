import React, { useEffect } from 'react';
import { Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18next';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import UploadFeature from './pages/features/UploadFeature';
import ReminderFeature from './pages/features/ReminderFeature';
import ExternalLinkFeature from './pages/features/ExternalLinkFeature';
import FormFeature from './pages/features/FormFeature';
import AboutPage from './pages/static/AboutPage';
import PrivacyPolicyPage from './pages/static/PrivacyPolicyPage';
import TermsPage from './pages/static/TermsPage';
import ContactPage from './pages/static/ContactPage';
import FAQPage from './pages/static/FAQPage';
import QRCodePage from './pages/static/QRCodePage';
import PaymentPage from './pages/static/PaymentPage';
import ProfilePage from './pages/static/ProfilePage';
import EmergencyModePage from './pages/EmergencyModePage';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ui/ThemeToggle';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeToggle />
        <Header />
        <main className="container mx-auto py-6 px-4 flex-grow">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/category/:id" component={CategoryPage} />
            <Route path="/subcategory/:id" component={SubcategoryPage} />
            <Route path="/feature/upload/:id" component={UploadFeature} />
            <Route path="/feature/reminder/:id" component={ReminderFeature} />
            <Route path="/feature/external_link/:id" component={ExternalLinkFeature} />
            <Route path="/feature/form/:id" component={FormFeature} />
            <Route path="/about" component={AboutPage} />
            <Route path="/privacy" component={PrivacyPolicyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/faq" component={FAQPage} />
            <Route path="/qrcode" component={QRCodePage} />
            <Route path="/payment" component={PaymentPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/emergency" component={EmergencyModePage} />
          </Switch>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
