import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './downloadPhoto_photoApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('downloads a photo successfully', async () => {
  fetchMock.get('/download/1', { status: 200, body: 'image binary data' });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo downloaded/i)).toBeInTheDocument();
}, 10000);

test('fails to download a photo', async () => {
  fetchMock.get('/download/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/download failed/i)).toBeInTheDocument();
}, 10000);

test('should successfully set the resolution for viewing photos', async () => {
  fetchMock.post('/api/resolution', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resolution-input'), { target: { value: '1080p' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resolution-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resolution set')).toBeInTheDocument();
}, 10000);

test('should fail to set the resolution for viewing photos with error message', async () => {
  fetchMock.post('/api/resolution', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resolution-input'), { target: { value: '1080p' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resolution-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set resolution')).toBeInTheDocument();
}, 10000);