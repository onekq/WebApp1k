import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SLA from './taskSlaManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sets SLAs for tasks.', async () => {
  fetchMock.post('/api/task-sla', { success: true });

  await act(async () => { render(<MemoryRouter><SLA /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('SLAs set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set SLAs for tasks if server error.', async () => {
  fetchMock.post('/api/task-sla', 500);

  await act(async () => { render(<MemoryRouter><SLA /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set SLAs')).toBeInTheDocument();
}, 10000);