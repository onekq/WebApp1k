import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask_createTask_projectTemplateCreation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should attach a file to task successfully.', async () => {
  fetchMock.post('/api/attachFile', { status: 200, body: { taskId: 1, fileUrl: 'http://example.com/file.png' }});
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when attaching file fails.', async () => {
  fetchMock.post('/api/attachFile', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('Failed to attach file.')).toBeInTheDocument();
}, 10000);

test('should successfully create a new task.', async () => {
  fetchMock.post('/api/taskCreate', { status: 201, body: { id: 1, title: 'New Task', description: 'New task description' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New task description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to create a task.', async () => {
  fetchMock.post('/api/taskCreate', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Failed to create task.')).toBeInTheDocument();
}, 10000);

test('Create Project Template - success', async () => {
  fetchMock.post('/api/projects/template', 201);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
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
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
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
