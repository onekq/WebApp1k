import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPetMilestones_addVetContactInformation_logTrainingSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully adds a new pet milestone', async () => {
  fetchMock.post('/api/milestones/add', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('milestone-input'), { target: { value: 'Learned to Sit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Milestone added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to add new pet milestone', async () => {
  fetchMock.post('/api/milestones/add', { status: 400 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-milestone-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add milestone')).toBeInTheDocument();
}, 10000);

test('Add vet contact information successfully.', async () => {
  fetchMock.post('/api/vets', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: 'Dr. Smith'}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet contact information added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vet contact information due to missing vet name.', async () => {
  fetchMock.post('/api/vets', 400);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet name is required.')).toBeInTheDocument();
}, 10000);

test('Logs a training session successfully.', async () => {
  fetchMock.post('/training-sessions', { message: 'Training session logged' });

  await act(async () => { render(<MemoryRouter><LogTrainingSessions /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Obedience training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to log a training session with error message.', async () => {
  fetchMock.post('/training-sessions', { status: 500, body: { message: 'Failed to log training session' } });

  await act(async () => { render(<MemoryRouter><LogTrainingSessions /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Obedience training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
