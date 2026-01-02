import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Loading from "./components/Loading";

const TaskProfiles = lazy(() => import("./pages/TaskProfiles"));
const TaskProfileDetail = lazy(() => import("./pages/TaskProfileDetail"));
const TaskProfileLogs = lazy(() => import("./pages/TaskProfileLogs"));

interface AppRoute {
  path: string;
  element: React.ReactNode;
}

const routes: AppRoute[] = [
  { path: "/", element: <TaskProfiles /> },
  { path: "/taskprofile/create", element: <TaskProfileDetail /> },
  { path: "/taskprofile/:id", element: <TaskProfileDetail /> }, // เปลี่ยนจาก :param เป็น :id
  { path: "/taskprofilelog", element: <TaskProfileLogs /> },
];

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
