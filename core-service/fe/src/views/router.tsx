import { Component, PropsWithChildren, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IAuthenticatedData } from '../definitions';
import { LayoutComponent } from './components/layout/layout.component';
import { HomePage, LoginPage, NotFoundPage, PluginPage } from './pages';
import { PluginServicePage } from './pages/plugin-service';

export class ProtectedRoute extends Component<
  IAuthenticatedData & PropsWithChildren
> {
  render(): ReactNode {
    if (!this.props.user) {
      // user is not authenticated
      return <Navigate to="/login" />;
    }
    return this.props.children;
  }
}

export const AppRouter = (data: IAuthenticatedData) => {
  return (
    <Routes>
      <Route element={<LayoutComponent {...data} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={data.user}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plugin-service/:id"
          element={
            <ProtectedRoute user={data.user}>
              <PluginServicePage />
            </ProtectedRoute>
          }
        />

        {data.user?.role === 'admin' && (
          <Route
            path="/plugin"
            element={
              <ProtectedRoute user={data.user}>
                <PluginPage />
              </ProtectedRoute>
            }
          />
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
