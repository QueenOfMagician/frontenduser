import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Fungsi untuk memeriksa apakah access token sudah kadaluarsa
  const isAccessTokenExpired = () => {
    const expiry = sessionStorage.getItem('accessTokenExpiry');
    return expiry ? Date.now() > parseInt(expiry) : true;
  };

  // Cek apakah access token ada di session storage dan belum kadaluarsa
  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken || isAccessTokenExpired()) {
    return <Navigate to="/akun/signin" replace />;
  }

  return <Outlet />;
}
