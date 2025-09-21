import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivityLog_editVaccinationRecord_viewCommunityUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Edits an activity log successfully.', async () => {
  fetchMock.put('/activities/1', { message: 'Activity updated' });

  await act(async () => { render(<MemoryRouter><EditActivityLog activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to edit activity log with error message.', async () => {
  fetchMock.put('/activities/1', { status: 500, body: { message: 'Failed to update activity' } });

  await act(async () => { render(<MemoryRouter><EditActivityLog activityId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('activity-input'), { target: { value: 'Updated walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/activities/1').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Edit vaccination record successfully.', async () => {
  fetchMock.put('/api/vaccinations/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Vaccination record updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit vaccination record due to server error.', async () => {
  fetchMock.put('/api/vaccinations/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vaccine/i), {target: {value: 'Rabies'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Vaccination/i)); });

  expect(fetchMock.calls('/api/vaccinations/1').length).toBe(1);
  expect(screen.getByText('Failed to update vaccination record.')).toBeInTheDocument();
}, 10000);

test('Successfully views updates from the community', async () => {
  fetchMock.get('/api/community/updates', { status: 200, body: [{ id: 1, text: 'Community Update' }] });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Community Update')).toBeInTheDocument();
}, 10000);

test('Fails to fetch community updates', async () => {
  fetchMock.get('/api/community/updates', { status: 500 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch updates')).toBeInTheDocument();
}, 10000);
