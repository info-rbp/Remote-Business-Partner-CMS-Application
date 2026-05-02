import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { UsersMembership } from './pages/UsersMembership';
import { CampaignsSEO } from './pages/CampaignsSEO';
import { GlobalSettings } from './pages/GlobalSettings';
import { ResourcesListPage } from './pages/resources/ResourcesListPage';
import { ResourceEditorPage } from './pages/resources/ResourceEditorPage';
import { NavigationListPage } from './pages/navigation/NavigationListPage';
import { NavEditorPage } from './pages/navigation/NavEditorPage';
import { OffersListPage } from './pages/offers/OffersListPage';
import { OfferEditorPage } from './pages/offers/OfferEditorPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<UsersMembership />} />
                  <Route path="/campaigns" element={<CampaignsSEO />} />
                  <Route path="/settings" element={<GlobalSettings />} />
                  <Route path="/resources" element={<ResourcesListPage />} />
                  <Route path="/resources/:id/edit" element={<ResourceEditorPage />} />
                  <Route path="/resources/new" element={<ResourceEditorPage />} />
                  <Route path="/navigation" element={<NavigationListPage />} />
                  <Route path="/navigation/new" element={<NavEditorPage />} />
                  <Route path="/navigation/:id/edit" element={<NavEditorPage />} />
                  <Route path="/offers" element={<OffersListPage />} />
                  <Route path="/offers/new" element={<OfferEditorPage />} />
                  <Route path="/offers/:id/edit" element={<OfferEditorPage />} />
                </Routes>
              </AppLayout>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
