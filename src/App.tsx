import React from 'react';
import { Route, Switch } from 'wouter';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import UploadFeature from './pages/features/UploadFeature';
import ReminderFeature from './pages/features/ReminderFeature';
import ExternalLinkFeature from './pages/features/ExternalLinkFeature';
import FormFeature from './pages/features/FormFeature';

function App() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/category/:id" component={CategoryPage} />
        <Route path="/subcategory/:id" component={SubcategoryPage} />
        <Route path="/feature/upload/:id" component={UploadFeature} />
        <Route path="/feature/reminder/:id" component={ReminderFeature} />
        <Route path="/feature/external_link/:id" component={ExternalLinkFeature} />
        <Route path="/feature/form/:id" component={FormFeature} />
      </Switch>
    </div>
  );
}

export default App;
