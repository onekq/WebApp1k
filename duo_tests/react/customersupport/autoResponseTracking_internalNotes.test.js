import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseTracking_internalNotes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', { usage: '10 times' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 times')).toBeInTheDocument();
}, 10000);

test('Fails to track the use of auto-responses.', async () => {
  fetchMock.get('/api/getAutoResponseUsage', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track usage')).toBeInTheDocument();
}, 10000);

test('Adding internal notes to tickets should show success message.', async () => {
  fetchMock.post('/api/add-internal-note', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note added successfully')).toBeInTheDocument();
}, 10000);

test('Adding internal notes to tickets should show error message when failed.', async () => {
  fetchMock.post('/api/add-internal-note', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note addition failed')).toBeInTheDocument();
}, 10000);