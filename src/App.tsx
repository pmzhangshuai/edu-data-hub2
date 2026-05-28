import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import BasicLayout from '@/layouts/BasicLayout';

const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Sources = lazy(() => import('@/pages/DataAcquisition/Sources'));
const Mapping = lazy(() => import('@/pages/DataAcquisition/Mapping'));

const SimplePlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: 24 }}>
    <h2>{title}</h2>
    <p>此功能正在开发中...</p>
  </div>
);

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
              <Route path="tasks" element={<SimplePlaceholder title="同步任务" />} />
              <Route path="semi-auto" element={<SimplePlaceholder title="半自动化采集" />} />
              <Route path="manual" element={<SimplePlaceholder title="人工补录" />} />
            </Route>

            <Route path="data-governance" element={<SimplePlaceholder title="数据治理" />} />
            <Route path="indicator-system" element={<SimplePlaceholder title="指标体系" />} />
            <Route path="monitoring-analysis" element={<SimplePlaceholder title="监测分析" />} />
            <Route path="report-generation" element={<SimplePlaceholder title="报告生成" />} />
            <Route path="assessment-certification" element={<SimplePlaceholder title="评估认证" />} />
            <Route path="system-management" element={<SimplePlaceholder title="系统管理" />} />
            <Route path="integration" element={<SimplePlaceholder title="开放集成" />} />
            <Route path="mobile-experience" element={<SimplePlaceholder title="移动端体验" />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppContent;
