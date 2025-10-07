import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editAllergies_searchActivityLogs_addPetMilestones_viewTrainingSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Edit allergies successfully. (from editAllergies_searchActivityLogs)', async () => {
  fetchMock.put('/api/allergies/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Allergy updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit allergies due to server error. (from editAllergies_searchActivityLogs)', async () => {
  fetchMock.put('/api/allergies/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Failed to update allergy.')).toBeInTheDocument();
}, 10000);

test('Searches activities by keyword successfully. (from editAllergies_searchActivityLogs)', async () => {
  fetchMock.get('/activities?keyword=walk', [{ description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to search activities with error message. (from editAllergies_searchActivityLogs)', async () => {
  fetchMock.get('/activities?keyword=walk', { status: 500, body: { message: 'Failed to search activities' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully adds a new pet milestone (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.post('/api/milestones/add', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Sit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add new pet milestone (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.post('/api/milestones/add', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add milestone')).toBeInTheDocument();
}, 10000);

test('Views training sessions list successfully. (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.get('/training-sessions', [{ description: 'Obedience training' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByText('Obedience training')).toBeInTheDocument();
}, 10000);

test('Fails to view training sessions list with error message. (from addPetMilestones_viewTrainingSessions)', async () => {
  fetchMock.get('/training-sessions', { status: 500, body: { message: 'Failed to fetch training sessions' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

