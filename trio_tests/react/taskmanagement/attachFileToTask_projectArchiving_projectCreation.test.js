import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask_projectArchiving_projectCreation';

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

test('Archive Project - success', async () => {
  fetchMock.post('/api/projects/archive', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/project archived successfully/i)).toBeInTheDocument();
}, 10000);

test('Archive Project - failure', async () => {
  fetchMock.post('/api/projects/archive', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/failed to archive project/i)).toBeInTheDocument();
}, 10000);

test('Create Project - success', async () => {
  fetchMock.post('/api/projects', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/project created successfully/i)).toBeInTheDocument();
}, 10000);

test('Create Project - failure', async () => {
  fetchMock.post('/api/projects', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
}, 10000);
