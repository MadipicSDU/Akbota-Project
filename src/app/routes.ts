import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Payments from './pages/Payments';
import AdminPanel from './pages/AdminPanel';
import Pricing from './pages/Pricing';
import SubmitReview from './pages/SubmitReview';
import CompletedProjects from './pages/CompletedProjects';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'projects', Component: Projects },
      { path: 'projects/:id', Component: ProjectDetails },
      { path: 'projects/create', Component: CreateProject },
      { path: 'completed-projects', Component: CompletedProjects },
      { path: 'profile', Component: Profile },
      { path: 'profile/edit', Component: EditProfile },
      { path: 'messages', Component: Messages },
      { path: 'messages/:conversationId', Component: Messages },
      { path: 'notifications', Component: Notifications },
      { path: 'payments', Component: Payments },
      { path: 'pricing', Component: Pricing },
      { path: 'submit-review', Component: SubmitReview },
      { path: 'admin', Component: AdminPanel },
    ],
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
