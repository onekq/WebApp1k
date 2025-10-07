import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask_projectTemplateCreation_projectArchiving_projectMilestoneAddition';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should attach a file to task successfully. (from attachFileToTask_projectTemplateCreation)', async () => {
  fetchMock.post('/api/attachFile', { status: 200, body: { taskId: 1, fileUrl: 'http://example.com/file.png' }});
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when attaching file fails. (from attachFileToTask_projectTemplateCreation)', async () => {
  fetchMock.post('/api/attachFile', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('Failed to attach file.')).toBeInTheDocument();
}, 10000);

test('Create Project Template - success (from attachFileToTask_projectTemplateCreation)', async () => {
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

test('Create Project Template - failure (from attachFileToTask_projectTemplateCreation)', async () => {
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

test('Archive Project - success (from projectArchiving_projectMilestoneAddition)', async () => {
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

test('Archive Project - failure (from projectArchiving_projectMilestoneAddition)', async () => {
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

test('Add Milestone to Project - success (from projectArchiving_projectMilestoneAddition)', async () => {
  fetchMock.post('/api/projects/milestone', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/milestone added successfully/i)).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - failure (from projectArchiving_projectMilestoneAddition)', async () => {
  fetchMock.post('/api/projects/milestone', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/failed to add milestone/i)).toBeInTheDocument();
}, 10000);

