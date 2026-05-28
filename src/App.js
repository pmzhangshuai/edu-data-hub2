import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';
const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Sources = lazy(() => import('@/pages/DataAcquisition/Sources'));
const SimplePlaceholder = ({ title }) => (_jsxs("div", { style: { padding: 24 }, children: [_jsx("h2", { children: title }), _jsx("p", { children: "\u6B64\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D..." })] }));
const Loading = () => (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }, children: _jsx(Spin, { size: "large" }) }));
const AppContent = () => {
    return (_jsx(BrowserRouter, { children: _jsx(Suspense, { fallback: _jsx(Loading, {}), children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(BasicLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "home", element: _jsx(Home, {}) }), _jsxs(Route, { path: "data-acquisition", children: [_jsx(Route, { path: "sources", element: _jsx(Sources, {}) }), _jsx(Route, { path: "mapping", element: _jsx(SimplePlaceholder, { title: "\u6620\u5C04\u914D\u7F6E" }) }), _jsx(Route, { path: "tasks", element: _jsx(SimplePlaceholder, { title: "\u540C\u6B65\u4EFB\u52A1" }) }), _jsx(Route, { path: "semi-auto", element: _jsx(SimplePlaceholder, { title: "\u534A\u81EA\u52A8\u5316\u91C7\u96C6" }) }), _jsx(Route, { path: "manual", element: _jsx(SimplePlaceholder, { title: "\u4EBA\u5DE5\u8865\u5F55" }) })] }), _jsx(Route, { path: "data-governance", element: _jsx(SimplePlaceholder, { title: "\u6570\u636E\u6CBB\u7406" }) }), _jsx(Route, { path: "indicator-system", element: _jsx(SimplePlaceholder, { title: "\u6307\u6807\u4F53\u7CFB" }) }), _jsx(Route, { path: "monitoring-analysis", element: _jsx(SimplePlaceholder, { title: "\u76D1\u6D4B\u5206\u6790" }) }), _jsx(Route, { path: "report-generation", element: _jsx(SimplePlaceholder, { title: "\u62A5\u544A\u751F\u6210" }) }), _jsx(Route, { path: "assessment-certification", element: _jsx(SimplePlaceholder, { title: "\u8BC4\u4F30\u8BA4\u8BC1" }) }), _jsx(Route, { path: "system-management", element: _jsx(SimplePlaceholder, { title: "\u7CFB\u7EDF\u7BA1\u7406" }) }), _jsx(Route, { path: "integration", element: _jsx(SimplePlaceholder, { title: "\u5F00\u653E\u96C6\u6210" }) }), _jsx(Route, { path: "mobile-experience", element: _jsx(SimplePlaceholder, { title: "\u79FB\u52A8\u7AEF\u4F53\u9A8C" }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }) }));
};
export default AppContent;
