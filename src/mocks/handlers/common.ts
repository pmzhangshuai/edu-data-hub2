/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { mockUsers, mockDataSources, mockSyncTasks, mockIndicators } from '../data';

export const commonHandlers = [
  http.get('/api/user/info', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockUsers[0],
      success: true
    });
  }),

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
          expiresIn: 7200
        },
        success: true
      });
    }
    return HttpResponse.json(
      {
        code: 401,
        message: '用户名或密码错误',
        data: { token: '', refreshToken: '', user: mockUsers[0], expiresIn: 0 },
        success: false
      },
      { status: 401 }
    );
  }),

  http.get('/api/data-sources', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || '';
    const type = url.searchParams.get('type') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    let filteredData = [...mockDataSources];

    if (name) {
      filteredData = filteredData.filter(item => item.name.includes(name));
    }

    if (type) {
      filteredData = filteredData.filter(item => item.type === type);
    }

    if (status) {
      filteredData = filteredData.filter(item => item.status.toString() === status);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: paginatedData,
        pagination: {
          page: page,
          pageSize: pageSize,
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / pageSize)
        }
      },
      success: true
    });
  }),

  http.get('/api/data-sources/:id', ({ params }) => {
    const id = String(params.id);
    const dataSource = mockDataSources.find(ds => ds.id === id);

    if (dataSource) {
      return HttpResponse.json({
        code: 200,
        message: 'success',
        data: dataSource,
        success: true
      });
    }
    return HttpResponse.json(
      {
        code: 404,
        message: '数据源不存在',
        data: mockDataSources[0],
        success: false
      },
      { status: 404 }
    );
  }),

  http.post('/api/data-sources', async ({ request }) => {
    const body = await request.json() as any;
    const newDataSource = {
      id: `ds-${Date.now()}`,
      ...body,
      status: 1,
      createTime: new Date().toISOString()
    };
    mockDataSources.push(newDataSource);
    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      data: newDataSource,
      success: true
    });
  }),

  http.put('/api/data-sources/:id', async ({ params, request }) => {
    const id = String(params.id);
    const body = await request.json() as any;
    const index = mockDataSources.findIndex(ds => ds.id === id);
    if (index !== -1) {
      mockDataSources[index] = { ...mockDataSources[index], ...body };
    }
    return HttpResponse.json({
      code: 200,
      message: '更新成功',
      data: mockDataSources[index],
      success: true
    });
  }),

  http.delete('/api/data-sources/:id', ({ params }) => {
    const id = String(params.id);
    const index = mockDataSources.findIndex(ds => ds.id === id);
    if (index !== -1) {
      mockDataSources.splice(index, 1);
    }
    return HttpResponse.json({
      code: 200,
      message: '删除成功',
      data: null,
      success: true
    });
  }),

  http.post('/api/data-sources/:id/test-connection', () => {
    return HttpResponse.json({
      code: 200,
      message: '连接成功',
      data: {
        success: true,
        message: '连接成功',
        latencyMs: Math.floor(Math.random() * 100 + 10)
      },
      success: true
    });
  }),

  http.post('/api/data-sources/batch-delete', async ({ request }) => {
    const body = await request.json() as any;
    const ids = body.ids || [];
    ids.forEach((id: string) => {
      const index = mockDataSources.findIndex(ds => ds.id === id);
      if (index !== -1) {
        mockDataSources.splice(index, 1);
      }
    });
    return HttpResponse.json({
      code: 200,
      message: '批量删除成功',
      data: null,
      success: true
    });
  }),

  http.get('/api/sync-tasks', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: mockSyncTasks,
        pagination: {
          page: 1, pageSize: 10, total: mockSyncTasks.length, totalPages: 1
        }
      },
      success: true
    });
  }),

  http.get('/api/sync-tasks/:id', ({ params }) => {
    const id = String(params.id);
    const task = mockSyncTasks.find(t => t.id === id);
    if (task) {
      return HttpResponse.json({
        code: 200,
        message: 'success',
        data: task,
        success: true
      });
    }
    return HttpResponse.json(
      {
        code: 404,
        message: '任务不存在',
        data: mockSyncTasks[0],
        success: false
      },
      { status: 404 }
    );
  }),

  http.post('/api/sync-tasks', async ({ request }) => {
    const body = await request.json() as any;
    const newTask = {
      id: `task-${Date.now()}`,
      ...body,
      status: 'paused',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockSyncTasks.push(newTask);
    return HttpResponse.json({
      code: 200,
      message: '创建成功',
      data: newTask,
      success: true
    });
  }),

  http.post('/api/sync-tasks/:id/execute', () => {
    return HttpResponse.json({
      code: 200,
      message: '任务已启动',
      data: {
        instanceId: `inst-${Date.now()}`,
        status: 'running'
      },
      success: true
    });
  }),

  http.get('/api/indicators', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        list: mockIndicators,
        pagination: {
          page: 1, pageSize: 10, total: mockIndicators.length, totalPages: 1
        }
      },
      success: true
    });
  }),

  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: {
        totalDataSources: mockDataSources.length,
        activeDataSources: mockDataSources.filter(ds => ds.status === 1).length,
        totalTasks: mockSyncTasks.length,
        runningTasks: mockSyncTasks.filter(t => t.status === 'running').length,
        successTasks: mockSyncTasks.filter(t => t.status === 'success').length,
        failedTasks: mockSyncTasks.filter(t => t.status === 'failed').length,
        todaySyncRecords: 125000,
        errorRecords: 15
      },
      success: true
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
        { key: '/mobile-experience', label: '移动端体验' }
      ],
      success: true
    });
  })
];
