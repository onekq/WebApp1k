import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoEditingRotate_photoGeotagging_photoResolutionSettings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully rotate a photo', async () => {
  fetchMock.post('/api/rotate', { id: 1, rotated: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo rotated')).toBeInTheDocument();
}, 10000);

test('should fail to rotate a photo with error message', async () => {
  fetchMock.post('/api/rotate', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rotate-input'), { target: { value: '90' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rotate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rotate photo')).toBeInTheDocument();
}, 10000);

test('should successfully add/edit geotags on a photo', async () => {
  fetchMock.post('/api/geotag', { id: 1, geotag: 'Paris' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('geotag-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('geotag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Geotag added')).toBeInTheDocument();
}, 10000);

test('should fail to add/edit geotags on a photo with error message', async () => {
  fetchMock.post('/api/geotag', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('geotag-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('geotag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add geotag')).toBeInTheDocument();
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
