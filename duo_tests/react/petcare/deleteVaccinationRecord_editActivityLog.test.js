import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteVaccinationRecord_editActivityLog';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Delete vaccination record successfully.', async () => {
  fetchMock.delete('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete vaccination record due to server error.', async () => {
  fetchMock.delete('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to delete vaccination record.')).toBeInTheDocument();
}, 10000);

test('Edits an activity log successfully.', async () => {
  fetchMock.put('/activities/1', { message: 'Activity updated' });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit activity log with error message.', async () => {
  fetchMock.put('/activities/1', { status: 500, body: { message: 'Failed to update activity' } });

  await act(async () => { render(<MemoryRouter><App activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);