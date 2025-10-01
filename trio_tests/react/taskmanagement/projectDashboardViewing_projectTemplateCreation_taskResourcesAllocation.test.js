import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectDashboardViewing_projectTemplateCreation_taskResourcesAllocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('View Project Dashboard - success', async () => {
  fetchMock.get('/api/projects/dashboard', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view dashboard/i }));
  });

  expect(fetchMock.calls('/api/projects/dashboard')).toHaveLength(1);
  expect(screen.getByText(/project dashboard/i)).toBeInTheDocument();
}, 10000);

test('View Project Dashboard - failure', async () => {
  fetchMock.get('/api/projects/dashboard', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /view dashboard/i }));
  });

  expect(fetchMock.calls('/api/projects/dashboard')).toHaveLength(1);
  expect(screen.getByText(/failed to load dashboard/i)).toBeInTheDocument();
}, 10000);

test('Create Project Template - success', async () => {
  fetchMock.post('/api/projects/template', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/template name/i), { target: { value: 'Template1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create template/i }));
  });

  expect(fetchMock.calls('/api/projects/template')).toHaveLength(1);
  expect(screen.getByText(/template created successfully/i)).toBeInTheDocument();
}, 10000);

test('Create Project Template - failure', async () => {
  fetchMock.post('/api/projects/template', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/template name/i), { target: { value: 'Template1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create template/i }));
  });

  expect(fetchMock.calls('/api/projects/template')).toHaveLength(1);
  expect(screen.getByText(/failed to create template/i)).toBeInTheDocument();
}, 10000);

test('successfully allocates resources to a task.', async () => {
  fetchMock.post('/api/resource-allocation', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Resource allocated successfully')).toBeInTheDocument();
}, 10000);

test('fails to allocate resources to a task if server error.', async () => {
  fetchMock.post('/api/resource-allocation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to allocate resource')).toBeInTheDocument();
}, 10000);
