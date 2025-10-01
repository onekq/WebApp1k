import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editHealthCheckup_followAUser_searchActivityLogs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Edit health checkup successfully', async () => {
  fetchMock.put('/api/health-checkups/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: 'Bi-Annual Checkup' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups/1').length).toBe(1);
  expect(screen.getByText('Health checkup updated')).toBeInTheDocument();
}, 10000);

test('Fail to edit health checkup with error', async () => {
  fetchMock.put('/api/health-checkups/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('checkup-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-checkups/1').length).toBe(1);
  expect(screen.getByText('Failed to update health checkup')).toBeInTheDocument(); // Error message
}, 10000);

test('Successfully follows a user', async () => {
  fetchMock.post('/api/users/follow', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Followed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to follow a user', async () => {
  fetchMock.post('/api/users/follow', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button', { name: /follow/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to follow user')).toBeInTheDocument();
}, 10000);

test('Searches activities by keyword successfully.', async () => {
  fetchMock.get('/activities?keyword=walk', [{ description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to search activities with error message.', async () => {
  fetchMock.get('/activities?keyword=walk', { status: 500, body: { message: 'Failed to search activities' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
