import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterActivitiesByType_logVaccinationRecord_viewPetMilestones';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filters activities by type successfully.', async () => {
  fetchMock.get('/activities?type=walk', [{ type: 'walk', description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to filter activities by type with error message.', async () => {
  fetchMock.get('/activities?type=walk', { status: 500, body: { message: 'Failed to filter activities' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('filter-input'), { target: { value: 'walk' } }); });

  expect(fetchMock.calls('/activities?type=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Log vaccination record successfully', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: 'Rabies' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record logged')).toBeInTheDocument();
}, 10000);

test('Fail to log vaccination record with error', async () => {
  fetchMock.post('/api/vaccinations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Failed to log vaccination record')).toBeInTheDocument(); // Error message
}, 10000);

test('Successfully views pet milestones', async () => {
  fetchMock.get('/api/milestones/view', { status: 200, body: [{ id: 1, description: 'First birthday' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('First birthday')).toBeInTheDocument();
}, 10000);

test('Fails to view pet milestones', async () => {
  fetchMock.get('/api/milestones/view', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch milestones')).toBeInTheDocument();
}, 10000);
