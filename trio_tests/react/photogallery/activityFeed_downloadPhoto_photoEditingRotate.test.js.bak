import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './activityFeed_downloadPhoto_photoEditingRotate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Activity Feed: success', async () => {
  fetchMock.get('/api/activityFeed', { body: [{ id: 1, action: 'uploaded', item: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-1')).toBeInTheDocument();
}, 10000);

test('Activity Feed: failure', async () => {
  fetchMock.get('/api/activityFeed', { throws: new Error('Fetch Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-failure')).toBeInTheDocument();
}, 10000);

test('downloads a photo successfully', async () => {
  fetchMock.get('/download/1', { status: 200, body: 'image binary data' });

  await act(async () => {
    render(<MemoryRouter><PhotoDownloadComponent id="1" /></MemoryRouter>);
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
    render(<MemoryRouter><PhotoDownloadComponent id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/download failed/i)).toBeInTheDocument();
}, 10000);

test('should successfully rotate a photo', async () => {
  fetchMock.post('/api/rotate', { id: 1, rotated: true });

  await act(async () => { render(<MemoryRouter><RotatePhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo rotated')).toBeInTheDocument();
}, 10000);

test('should fail to rotate a photo with error message', async () => {
  fetchMock.post('/api/rotate', 404);

  await act(async () => { render(<MemoryRouter><RotatePhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rotate photo')).toBeInTheDocument();
}, 10000);
