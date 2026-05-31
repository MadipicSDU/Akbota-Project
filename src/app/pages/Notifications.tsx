import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Bell, MessageSquare, Star, Briefcase, CheckCircle } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationAsRead } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClick = (notificationId: string, link?: string) => {
    markNotificationAsRead(notificationId);
    if (link) {
      navigate(link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'application':
        return <Briefcase className="w-5 h-5 text-green-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'project_status':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">
          Stay updated with your projects, messages, and activities
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No notifications yet</p>
          <Link
            to="/projects"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Browse projects to get started
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  New ({unreadNotifications.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {unreadNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                    className="w-full p-4 flex gap-4 hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 mb-1">{notification.title}</p>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Earlier</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {readNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                    className="w-full p-4 flex gap-4 hover:bg-gray-50 transition text-left opacity-75"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 mb-1">{notification.title}</p>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
