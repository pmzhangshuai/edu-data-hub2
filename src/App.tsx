import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';

const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Sources = lazy(() => import('@/pages/DataAcquisition/Sources'));
const Mapping = lazy(() => import('@/pages/DataAcquisition/Mapping'));
const Tasks = lazy(() => import('@/pages/DataAcquisition/Tasks'));
const SemiAuto = lazy(() => import('@/pages/DataAcquisition/SemiAuto'));
const Manual = lazy(() => import('@/pages/DataAcquisition/Manual'));

const { Quality, Metadata, Lifecycle, Cleaning } = require('@/pages/DataGovernance');
const { Library, Views, Dimensions } = require('@/pages/IndicatorSystem');
const { Dashboard, Analysis, Warning } = require('@/pages/MonitoringAnalysis');
const { Templates, Generate, Collaboration } = require('@/pages/ReportGeneration');
const { Audit, Professional, Standards } = require('@/pages/AssessmentCertification');
const { Permissions, Workflow, Logs, Organization } = require('@/pages/SystemManagement');
const { Interfaces, Push, Subscription } = require('@/pages/Integration');
const { App, Assistant } = require('@/pages/MobileExperience');

const Loading: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />

            <Route path="data-acquisition">
              <Route path="sources" element={<Sources />} />
              <Route path="mapping" element={<Mapping />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="semi-auto" element={<SemiAuto />} />
              <Route path="manual" element={<Manual />} />
            </Route>

            <Route path="data-governance">
              <Route path="quality" element={<Quality />} />
              <Route path="metadata" element={<Metadata />} />
              <Route path="lifecycle" element={<Lifecycle />} />
              <Route path="cleaning" element={<Cleaning />} />
            </Route>

            <Route path="indicator-system">
              <Route path="library" element={<Library />} />
              <Route path="views" element={<Views />} />
              <Route path="dimensions" element={<Dimensions />} />
            </Route>

            <Route path="monitoring-analysis">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="warning" element={<Warning />} />
            </Route>

            <Route path="report-generation">
              <Route path="templates" element={<Templates />} />
              <Route path="generate" element={<Generate />} />
              <Route path="collaboration" element={<Collaboration />} />
            </Route>

            <Route path="assessment-certification">
              <Route path="audit" element={<Audit />} />
              <Route path="professional" element={<Professional />} />
              <Route path="standards" element={<Standards />} />
            </Route>

            <Route path="system-management">
              <Route path="permissions" element={<Permissions />} />
              <Route path="workflow" element={<Workflow />} />
              <Route path="logs" element={<Logs />} />
              <Route path="organization" element={<Organization />} />
            </Route>

            <Route path="integration">
              <Route path="interfaces" element={<Interfaces />} />
              <Route path="push" element={<Push />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>

            <Route path="mobile-experience">
              <Route path="app" element={<App />} />
              <Route path="assistant" element={<Assistant />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppContent;
