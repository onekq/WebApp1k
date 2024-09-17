import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPetProfile_logTrainingSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add pet profile successfully.', async () => {
  fetchMock.post('/api/pets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Pet profile added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add pet profile due to missing name.', async () => {
  fetchMock.post('/api/pets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Name is required.')).toBeInTheDocument();
}, 10000);

test('Logs a training session successfully.', async () => {
  fetchMock.post('/training-sessions', { message: 'Training session logged' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Obedience training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Fails to log a training session with error message.', async () => {
  fetchMock.post('/training-sessions', { status: 500, body: { message: 'Failed to log training session' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('training-input'), { target: { value: 'Obedience training' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/training-sessions').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);