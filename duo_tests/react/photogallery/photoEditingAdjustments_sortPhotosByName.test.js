import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoEditingAdjustments_sortPhotosByName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully adjust photo settings', async () => {
  fetchMock.post('/api/adjustments', { id: 1, adjusted: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('adjustments-input'), { target: { value: 'brightness|10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjustments-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo adjusted')).toBeInTheDocument();
}, 10000);

test('should fail to adjust photo settings with error message', async () => {
  fetchMock.post('/api/adjustments', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('adjustments-input'), { target: { value: 'brightness|10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjustments-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust photo')).toBeInTheDocument();
}, 10000);

test('Users can successfully sort photos by name.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: true, data: ['photoA', 'photoB'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by name')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by name fails.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by name')).toBeInTheDocument();
}, 10000);