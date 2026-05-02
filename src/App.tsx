import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { UsersMembership } from './pages/UsersMembership';
import { CampaignsSEO } from './pages/CampaignsSEO';
import { GlobalSettings } from './pages/GlobalSettings';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersMembership />} />
          <Route path="/campaigns" element={<CampaignsSEO />} />
          <Route path="/settings" element={<GlobalSettings />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
