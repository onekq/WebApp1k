import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask';

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

