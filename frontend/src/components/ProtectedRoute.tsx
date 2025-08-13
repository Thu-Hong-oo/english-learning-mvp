import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth)

  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Nếu có yêu cầu role cụ thể
  if (allowedRoles.length > 0) {
    // Nếu user không có role hoặc role không được phép
    if (!user?.role || !allowedRoles.includes(user.role)) {
      // Redirect về trang phù hợp với role
      if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />
      } else if (user?.role === 'teacher') {
        return <Navigate to="/teacher" replace />
      } else {
        return <Navigate to="/" replace />
      }
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
