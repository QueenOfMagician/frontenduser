import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './page/utama/homepage';
import ProtectedRoute from './components/ProtectedRoute';
import BidPage from './page/utama/bidpage';
import SigninForm from './page/autentikasi/signinform';
import SignupForm from './page/autentikasi/signupform';
import NotFound from './page/error/urlnotfound';
import ListBarang from './page/utama/barang';
import AddItemForm from './page/utama/tambahbarang';
import { AuctionProvider } from '@/page/data/dataBarangLelang';
import BarangSaya from './page/utama/barangsaya';
import PesananSaya from './page/utama/pesanansaya';
import Profile from './page/utama/profile';

export default function App() {
  return (
    <AuctionProvider>
      <Router>
        <Routes>
          <Route path='/akun/signin' element={<SigninForm />} />
          <Route path='/akun/signup' element={<SignupForm />} />
          <Route path='*' element={<NotFound />} />

          {/* Protected Routes (Authenticated Access) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/biding/:kode" element={<BidPage />} />
            <Route path="/listbarang" element={<ListBarang />} />
            <Route path="/tambahBarang" element={<AddItemForm />} />
            <Route path="/barangsaya" element={<BarangSaya />} />
            <Route path="/pesanansaya" element={<PesananSaya />} />
            <Route path="/profil" element={<Profile />} />
            
            {/* Add more authenticated routes here */}
          </Route>
        </Routes>
      </Router>
    </AuctionProvider>
  );
}
