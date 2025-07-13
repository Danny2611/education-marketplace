import { FavoritesPage } from '../pages/FavoritesPage';
import { HistoryPage } from '../pages/HistoryPage';
import { HomePage } from '../pages/Home';
import { ProductDetailPage } from '../pages/ProductDetailPage';

const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: 'whist-list', element: <FavoritesPage /> },
  { path: 'history-view', element: <HistoryPage /> },
  { path: 'product-detail/:id', element: <ProductDetailPage /> },
];

export default publicRoutes;
