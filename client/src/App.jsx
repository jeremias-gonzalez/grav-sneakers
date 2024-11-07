import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DataProvider from './assets/components/Context/DataContext';
import ProductDetail from './assets/components/ProductDetail/ProductDetail';
import Loader from './assets/components/ui/loader'; // Importa el componente Loader
import BigCart from "./assets/components/BigCart/BigCart";
import OrdersList from './assets/components/admin/OrderList';
import Admin from './assets/components/admin/Admin';
import AddProducts from './assets/components/admin/AddProducts';
import Login from './assets/components/admin/Login';

// Lazy loading del componente Categorias
const Categorias = lazy(() =>
  new Promise((resolve) => {
    setTimeout(() => resolve(import('./assets/components/Categorias/Categorias')), 1000);
  })
);

const Home = lazy(() =>
  new Promise((resolve) => {
    setTimeout(() => resolve(import('./assets/components/Home/Home')), 1000);
  })
);

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader/></div>}>
              <Home />
            </Suspense>
          } />
          <Route path='/cart' element={<BigCart />} />
          <Route path='/detail' element={<ProductDetail />} />
          <Route path='/admin' element={<Admin />} />
          <Route path="/login" element={<Login />} /> {/* Aquí está la corrección */}
          <Route path='/admin/orders' element={<OrdersList />} />
          <Route path='/admin/productos' element={<AddProducts />} />
          <Route
            path='/categories'
            element={
              <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader/></div>}>
                <Categorias />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
