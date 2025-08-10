import React from 'react';
import { useAppSelector } from '../store/hooks';

// Component để debug Redux state (chỉ hiển thị trong development)
const ReduxDevTools: React.FC = () => {
  const authState = useAppSelector(state => state.auth);
  const userState = useAppSelector(state => state.user);

  // Chỉ hiển thị trong development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Redux State Debug</h3>
      <div className="space-y-2">
        <div>
          <strong>Auth:</strong>
          <pre className="text-green-400">
            {JSON.stringify({
              isAuthenticated: authState.isAuthenticated,
              loading: authState.loading,
              error: authState.error,
              user: authState.user ? {
                id: authState.user.id,
                username: authState.user.username,
                email: authState.user.email,
                fullName: authState.user.fullName
              } : null
            }, null, 2)}
          </pre>
        </div>
        <div>
          <strong>User:</strong>
          <pre className="text-blue-400">
            {JSON.stringify({
              profile: userState.profile ? {
                id: userState.profile.id,
                username: userState.profile.username,
                email: userState.profile.email
              } : null,
              isProfileComplete: userState.isProfileComplete
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ReduxDevTools;
