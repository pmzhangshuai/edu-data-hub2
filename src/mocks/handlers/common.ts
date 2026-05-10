/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { mockUsers, mockDataSources, mockSyncTasks, mockIndicators } from '../data';

export const commonHandlers = [
  http.get('/api/user/info', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockUsers[0],
      success: true,
    });
  }),

  // @ts-ignore
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    if (body.username === 'admin' && body.password === 'admin') {
      return HttpResponse.json({
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: mockUsers[0],
          expiresIn: 7200,
        },
        success: true,
      });
    }
    return HttpResponse.json({
      code: 401,
      message: '用户名或密码错误',
      data: null,
      success: false,
    }, { status: 401 });
  }),

  http.get('/api/data-sources', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: mockDataSources,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockDataSources.length,
          totalPages: 1,
        },
      },
      success: true,
    });
  }),

  // @ts-ignore
  http.get('/api/data-sources/:id', ({ params }) => {
    const dataSource = mockDataSources.find((ds) => ds.id === params.id);
    if (dataSource) {
      return HttpResponse.json({
        code: 200,
        message: 'success',
        data: dataSource,
        success: true,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '数据源不存在',
      data: null,
      success: false,
    }, { status: 404 });
  }),

  http.post('/api/data-sources', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      data: {
        id: `ds-${Date.now()}`,
        ...body,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      success: true,
    });
  }),

  http.put('/api/data-sources/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      code: 200,
      message: '更新成功',
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
      success: true,
    });
  }),

  http.delete('/api/data-sources/:id', () => {
    return HttpResponse.json({
      code: 200,
      message: '删除成功',
      data: null,
      success: true,
    });
  }),

  http.post('/api/data-sources/:id/test-connection', () => {
    return HttpResponse.json({
      code: 200,
      message: '连接成功',
      data: {
        success: true,
        message: '连接成功',
        latencyMs: 15,
      },
      success: true,
    });
  }),

  http.get('/api/sync-tasks', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: mockSyncTasks,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockSyncTasks.length,
          totalPages: 1,
        },
      },
      success: true,
    });
  }),

  // @ts-ignore
  http.get('/api/sync-tasks/:id', ({ params }) => {
    const task = mockSyncTasks.find((t) => t.id === params.id);
    if (task) {
      return HttpResponse.json({
        code: 200,
        message: 'success',
        data: task,
        success: true,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '任务不存在',
      data: null,
      success: false,
    }, { status: 404 });
  }),

  http.post('/api/sync-tasks', async ({ request }) => {
    const body = await request.json() as any;
    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      data: {
        id: `task-${Date.now()}`,
        ...body,
        status: 'paused',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      success: true,
    });
  }),

  http.post('/api/sync-tasks/:id/execute', () => {
    return HttpResponse.json({
      code: 200,
      message: '任务已启动',
      data: {
        instanceId: `inst-${Date.now()}`,
        status: 'running',
      },
      success: true,
    });
  }),

  http.get('/api/indicators', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: mockIndicators,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockIndicators.length,
          totalPages: 1,
        },
      },
      success: true,
    });
  }),

  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        totalDataSources: mockDataSources.length,
        activeDataSources: mockDataSources.filter((ds) => ds.status === 'active').length,
        totalTasks: mockSyncTasks.length,
        runningTasks: mockSyncTasks.filter((t) => t.status === 'running').length,
        successTasks: mockSyncTasks.filter((t) => t.status === 'success').length,
        failedTasks: mockSyncTasks.filter((t) => t.status === 'failed').length,
        todaySyncRecords: 125000,
        errorRecords: 15,
      },
      success: true,
    });
  }),

  http.get('/api/menu', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: [
        { key: '/home', label: '首页' },
        { key: '/data-acquisition', label: '数据采集' },
        { key: '/data-governance', label: '数据治理' },
        { key: '/indicator-system', label: '指标体系' },
        { key: '/monitoring-analysis', label: '监测分析' },
        { key: '/report-generation', label: '报告生成' },
        { key: '/assessment-certification', label: '评估认证' },
        { key: '/system-management', label: '系统管理' },
        { key: '/integration', label: '开放集成' },
        { key: '/mobile-experience', label: '移动端体验' },
      ],
      success: true,
    });
  }),
];
