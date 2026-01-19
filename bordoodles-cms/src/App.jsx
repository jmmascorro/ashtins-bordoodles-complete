import { Routes, Route } from 'react-router-dom';
import CMSLayout from './components/CMSLayout';
import DashboardHome from './pages/DashboardHome';
import PuppyManager from './pages/PuppyManager';
import ParentManager from './pages/ParentManager';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CMSLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="puppies" element={<PuppyManager />} />
        <Route path="parents" element={<ParentManager />} />
      </Route>
    </Routes>
  );
}

export default App;
