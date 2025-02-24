import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { privateRouter, publicRouter } from "./router/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            {privateRouter.map((route, index) => {
              const Layout = route.layout;
              const Page = route.page;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <Layout path={route.path}>
                        <Page />
                      </Layout>
                    </ProtectedRoute>
                  }
                ></Route>
              );
            })}
            {publicRouter.map((route, index) => {
              const Layout = route.layout;
              const Page = route.page;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout path={route.path}>
                      <Page />
                    </Layout>
                  }
                ></Route>
              );
            })}
            <Route path="*" element={<Navigate to={"/report"} />}></Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
